import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as moment from "moment";

import Config from "../../Config";
import { AccessToken } from "../../models/AccessToken";
import { RefreshToken } from "../../models/RefreshToken";
import { User } from "../../models/User";
import { preventTimingAttack } from "../../util/helpers";
import { errorCodes } from "./_errorCodes";
import { TokenSchema } from "./_schema";

export const token = [{
    method: "POST",
    path: "/api/v1/auth/token",
    handler: tokenHandler,
    config: {
        auth: false,
        description: "Get an access token",
        tags: ["api", "post", "v1", "auth", "token"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().required().unknown(true).keys({
                grantType: Joi.string().required().valid("password", "refreshToken")
            })
        },
        response: {
            schema: TokenSchema
        }
    }
}];

async function tokenHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const { grantType } = request.payload as any;
    let user;

    switch (grantType) {
        case "password":

            // Check Payload
            try {
                validateSchema(request.payload, Joi.object().keys({
                    grantType: Joi.string().required().valid("password", "refreshToken"),
                    username: Joi.string().required(),
                    password: Joi.string().required()
                }));
            } catch (err) {
                throw Boom.badRequest(err.message);
            }

            const { username, password } = request.payload as any;
            user = await User.find({ where: { username } });

            // Error out if user does not exist
            if (!user) {
                await preventTimingAttack();
                throw Boom.badRequest(errorCodes.INVALID_LOGIN);
            }

            // Error out if password is wrong
            if (!await User.comparePassword(password, user.password)) {
                await preventTimingAttack();
                throw Boom.badRequest(errorCodes.INVALID_LOGIN);
            }

            break;

        case "refreshToken":

            // Check Payload
            try {
                validateSchema(request.payload, Joi.object().keys({
                    grantType: Joi.string().required().valid("password", "refreshToken"),
                    refreshToken: Joi.string().guid().length(36).required()
                }));
            } catch (err) {
                throw Boom.badRequest(err.message);
            }

            // tslint:disable-next-line:no-shadowed-variable
            const { refreshToken } = request.payload as any;

            const tokenInstance = await RefreshToken.find({ where: { token: refreshToken } });

            // Error out if refresh token does not exist
            if (!tokenInstance) {
                await preventTimingAttack();
                throw Boom.badRequest(errorCodes.INVALID_LOGIN);
            }

            user = await tokenInstance.$get("User", {}) as User;

            // Destroy the refresh token
            await tokenInstance.destroy();

            break;

        default:
            throw Boom.badRequest(errorCodes.INVALID_GRANT_TYPE);
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

function validateSchema(payload: Object, schema: Joi.JoiObject) {
    const result = Joi.validate(payload, schema);
    if (result.error) {
        throw new Error(result.error.toString());
    }

    return Promise.resolve(result.value);
}
