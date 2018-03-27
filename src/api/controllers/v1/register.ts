import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as zxcvbn from "zxcvbn";
import * as moment from "moment";

import Config from "../../../shared/Config";
import sequelize, { Transaction } from "../../../shared/util/sequelize";
import { User } from "../../../shared/models/User";
import { AppUserProfile } from "../../../shared/models/AppUserProfile";
import { AccessToken } from "../../../shared/models/AccessToken";
import { RefreshToken } from "../../../shared/models/RefreshToken";

export const register = [{
    method: "POST",
    path: "/v1/auth/register",
    handler: registerHandler,
    config: {
        auth: false,
        description: "Registers a user",
        tags: ["api", "get", "v1", "auth", "register"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().required().keys({
                username: Joi.string().required(),
                password: Joi.string().required(),
                name: Joi.string().required(),
                imageUid: Joi.string().guid().length(36).optional().allow(null).description("uid of user profile image"),
            })
        },
        response: {
            schema: Joi.object().required().keys({
                tokenType: Joi.string().required(),
                refreshToken: Joi.string().guid().length(36).required(),
                accessToken: Joi.string().guid().length(36).required(),
                expiresIn: Joi.number().required()
            })
        },
    }
}];

async function registerHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const { username, password, name } = request.payload as any;

    // Error out if user already exists
    if (await User.find({ where: { username } })) {
        throw Boom.badRequest("User already exists");
    }

    // Error out if password is to weak
    const zxcvbnInfo = zxcvbn(password);
    if (zxcvbnInfo.score < Config.auth.zxcvbnScore) {
        throw Boom.badRequest("Password is to weak", {
            warning: zxcvbnInfo.feedback.warning,
            score: zxcvbnInfo.score
        });
    }

    // Create user within transaction
    return sequelize.transaction(async (transaction: Transaction) => {

        // Create user
        const user = await User.create({
            username,
            password: await User.hashPassword(password)
        });

        // Create app user profile and tokens
        const [, refreshToken, accessToken] = await Promise.all([
            await user.$create("AppUserProfile", { name }) as AppUserProfile,
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

    });

}
