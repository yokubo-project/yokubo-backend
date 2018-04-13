import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as zxcvbn from "zxcvbn";
import * as moment from "moment";

import Config from "../../../shared/Config";
import { User } from "../../../shared/models/User";
import { AccessToken } from "../../../shared/models/AccessToken";
import { RefreshToken } from "../../../shared/models/RefreshToken";
import { Token } from "./_schema";
import { preventTimingAttack } from "../../../shared/util/helpers";

export const resetPwd = [{
    method: "POST",
    path: "/v1/auth/resetpwd",
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
                newPwd: Joi.string().required(),
            })
        },
        response: {
            schema: Token
        },
    }
}];

async function resetPwdHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const user: User = (request.auth.credentials as any).user;
    const { currentPwd, newPwd } = request.payload as any;

    // Error out if current pwd does not match
    if (!await User.comparePassword(currentPwd, user.password)) {
        await preventTimingAttack(); // Prevent timing attacks
        throw Boom.badRequest("Current Pwd does not match");
    }

    // Error out if new password is to weak
    const zxcvbnInfo = zxcvbn(newPwd);
    if (zxcvbnInfo.score < Config.auth.zxcvbnScore) {
        throw Boom.badRequest("Password is to weak", {
            warning: zxcvbnInfo.feedback.warning,
            score: zxcvbnInfo.score
        });
    }

    // Save new password
    user.update({
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
