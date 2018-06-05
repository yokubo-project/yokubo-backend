import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as moment from "moment";
import * as zxcvbn from "zxcvbn";

import Config from "../../Config";
import { AccessToken } from "../../models/AccessToken";
import { RefreshToken } from "../../models/RefreshToken";
import { User } from "../../models/User";
import { preventTimingAttack } from "../../util/helpers";
import { errorCodes } from "./_errorCodes";
import { TokenSchema } from "./_schema";

export const resetPwd = [{
    method: "POST",
    path: "/api/v1/auth/resetpwd",
    handler: resetPwdHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Reset password of a user",
        tags: ["api", "post", "v1", "auth", "resetpwd"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().required().keys({
                currentPwd: Joi.string().required(),
                newPwd: Joi.string().required()
            })
        },
        response: {
            schema: TokenSchema
        }
    }
}];

async function resetPwdHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const user: User = (request.auth.credentials as any).user;
    const { currentPwd, newPwd } = request.payload as any;

    // Error out if current pwd does not match
    if (!await User.comparePassword(currentPwd, user.password)) {
        await preventTimingAttack();
        throw Boom.badRequest(errorCodes.PASSWORDS_DONT_MATCH);
    }

    // Error out if new password is to weak
    const zxcvbnInfo = zxcvbn(newPwd);
    if (zxcvbnInfo.score < Config.auth.zxcvbnScore) {
        throw Boom.badRequest(errorCodes.PASSWORD_WEAK, {
            warning: zxcvbnInfo.feedback.warning,
            score: zxcvbnInfo.score
        });
    }

    // Save new password
    await user.update({
        password: await User.hashPassword(newPwd)
    });

    // Create tokens
    const [refreshToken, accessToken] = await Promise.all([
        await user.$create("RefreshToken", {}) as RefreshToken,
        await user.$create("AccessToken", {
            validUntil: moment().add(Config.auth.tokenExpiresIn, "milliseconds").toDate()
        }) as AccessToken
    ]);

    return {
        tokenType: "Bearer",
        refreshToken: refreshToken.token,
        accessToken: accessToken.token,
        expiresIn: Config.auth.tokenExpiresIn
    };

}
