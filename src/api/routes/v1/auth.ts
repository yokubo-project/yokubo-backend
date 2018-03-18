import * as Joi from "joi";

import * as controller from "../../controllers/v1/auth";

export const auth = [
    {
        method: "POST",
        path: "/v1/auth/register",
        handler: controller.register,
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
                    // imageUid: Joi.string().guid().length(36).optional().allow(null).description("uid of user profile image"),
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
    }, 
    {
        method: "POST",
        path: "/v1/auth/token",
        handler: controller.token,
        config: {
            auth: false,
            description: "Get an access token",
            tags: ["api", "get", "v1", "auth", "token"],
            validate: {
                options: {
                    abortEarly: false
                },
                payload: Joi.object().required().unknown(true).keys({
                    grantType: Joi.string().required().valid("password", "refreshToken"),
                })
            },
            response: {
                schema: Joi.object().required().keys({
                    tokenType: Joi.string().required(),
                    refreshToken: Joi.string().required(),
                    accessToken: Joi.string().required(),
                    expiresIn: Joi.number().required()
                })
            },
        }        
    }
];
