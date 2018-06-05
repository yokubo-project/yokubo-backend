import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import { User } from "../../models/User";
import { errorCodes } from "./_errorCodes";
import { UserSchema } from "./_schema";

export const patchUser = [{
    method: "PATCH",
    path: "/api/v1/auth/user",
    handler: patchUserHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Patch user",
        tags: ["api", "patch", "v1", "user"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().required().keys({
                name: Joi.string().optional(),
                username: Joi.string().trim().email().optional()
            })
        },
        response: {
            schema: UserSchema
        }
    }
}];

async function patchUserHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const user: User = (request.auth.credentials as any).user;

    // Error out if username already exists
    if (await User.find({ where: { username: (request.payload as any).username } })) {
        throw Boom.badRequest(errorCodes.USER_ALREADY_EXISTS);
    }

    // Patch user
    await user.update({
        ...request.payload as any
    });

    return user.publicJsonObject();

}
