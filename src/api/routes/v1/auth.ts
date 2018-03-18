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
                    refreshToken: Joi.string().required(),
                    accessToken: Joi.string().required(),
                    expiresIn: Joi.number().required()
                })
            },
        }
    }
];
