import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as moment from "moment";
import * as zxcvbn from "zxcvbn";

import Config from "../../Config";
import { AccessToken } from "../../models/AccessToken";
import { RefreshToken } from "../../models/RefreshToken";
import { User } from "../../models/User";
import sequelize, { Transaction } from "../../util/sequelize";
import { errorCodes } from "./_errorCodes";
import { TokenSchema } from "./_schema";

export const register = [{
    method: "POST",
    path: "/api/v1/auth/register",
    handler: registerHandler,
    config: {
        auth: false,
        description: "Registers a user",
        tags: ["api", "post", "v1", "auth", "register"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().required().keys({
                username: Joi.string().trim().email().required(),
                password: Joi.string().required(),
                name: Joi.string().required(),
                imageUid: Joi.string().guid().length(36).optional().allow(null).description("uid of user profile image")
            })
        },
        response: {
            schema: TokenSchema
        }
    }
}];

async function registerHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const { username, password, name } = request.payload as any;

    // Error out if user already exists
    if (await User.find({ where: { username } })) {
        throw Boom.badRequest(errorCodes.USER_ALREADY_EXISTS);
    }

    // Error out if password is to weak
    const zxcvbnInfo = zxcvbn(password);
    if (zxcvbnInfo.score < Config.auth.zxcvbnScore) {
        throw Boom.badRequest(errorCodes.PASSWORD_WEAK, {
            warning: zxcvbnInfo.feedback.warning,
            score: zxcvbnInfo.score
        });
    }

    // Create user within transaction
    return sequelize.transaction(async (transaction: Transaction) => {

        // Create user
        const user = await User.create({
            username,
            password: await User.hashPassword(password),
            name
        });

        // Create app user profile and tokens
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

    });

}
