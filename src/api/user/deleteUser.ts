import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import { User } from "../../models/User";
import { preventTimingAttack } from "../../util/helpers";
import { errorCodes } from "./_errorCodes";
import { UserSchema } from "./_schema";

export const deleteUser = [{
    method: "DELETE",
    path: "/api/v1/auth/user",
    handler: deleteUserHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Delete user",
        tags: ["api", "delete", "v1", "user"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().required().keys({
                currentPwd: Joi.string().required()
            })
        },
        response: {
            schema: UserSchema
        }
    }
}];

async function deleteUserHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const user: User = (request.auth.credentials as any).user;
    const { currentPwd } = request.payload as any;

    // Error out if current pwd does not match
    if (!await User.comparePassword(currentPwd, user.password)) {
        await preventTimingAttack();
        throw Boom.badRequest(errorCodes.PASSWORDS_DONT_MATCH);
    }

    // Delete user
    await user.destroy();

    return user.publicJsonObject();

}
