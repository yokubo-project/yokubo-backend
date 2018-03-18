import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as zxcvbn from "zxcvbn";
import * as moment from "moment";
import * as _ from "lodash";

import Config from "../../../shared/Config";
import sequelize, { Transaction } from "../../../shared/util/sequelize";
import { User } from "../../../shared/models/User";
import { AppUserProfile } from "../../../shared/models/AppUserProfile";
import { AccessToken } from "../../../shared/models/AccessToken";
import { RefreshToken } from "../../../shared/models/RefreshToken";

export async function register(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

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

export async function token(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const { grantType } = request.payload as any;
    let user;

    switch (grantType) {
        case "password":

            // Check Payload
            try {
                validateSchema(request.payload, Joi.object().keys({
                    grantType: Joi.string().required().valid("password", "refreshToken"),
                    username: Joi.string().required(),
                    password: Joi.string().required(),
                }));
            } catch (err) {
                throw Boom.badRequest(err.message);
            }

            const { username, password } = request.payload as any;
            user = await User.find({ where: { username } });

            // Error out if user does not exist
            if (!user) {
                await preventTimingAttack(); // Prevent timing attacks
                throw Boom.badRequest("Invalid login");
            }

            // Error out if password is wrong
            if (!await User.comparePassword(password, user.password)) {
                await preventTimingAttack(); // Prevent timing attacks
                throw Boom.badRequest("Invalid login");
            }

            break;

        case "refreshToken":

            // Check Payload
            try {
                validateSchema(request.payload, Joi.object().keys({
                    grantType: Joi.string().required().valid("password", "refreshToken"),
                    refreshToken: Joi.string().guid().length(36).required(),
                }));
            } catch (err) {
                throw Boom.badRequest(err.message);
            }

            const { refreshToken } = request.payload as any;

            const tokenInstance = await RefreshToken.find({ where: { token: refreshToken } });

            // Error out if refresh token does not exist
            if (!tokenInstance) {
                await preventTimingAttack(); // Prevent timing attacks
                throw Boom.badRequest("Invalid login");
            }

            user = await tokenInstance.$get("User", {}) as User;

            // Destroy the refresh token
            await tokenInstance.destroy();

            break;

        default:

            throw new Error(`Invalid grantType: ${grantType}`);
    }

    user.save(); // Update timestamp

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

async function preventTimingAttack(): Promise<any> {
    return await Promise.delay(_.random(50, 300));
}

export function validateSchema(payload: Object, schema: Joi.JoiObject) {
    let result = Joi.validate(payload, schema);
    if (result.error) {
        throw new Error(result.error.toString());
    }
    return Promise.resolve(result.value);
}
