import * as Joi from "joi";

import * as controller from "../../controllers/v1/auth";

export const auth = [
    {
        method: "GET",
        path: "/v1/auth/register",
        handler: controller.register,
        config: {
            auth: false,
            description: "Registers a user",
            tags: ["api", "get", "v1", "auth", "register"],
            response: {
                schema: Joi.object().required().keys({
                    result: Joi.string().required()
                })
            },
        }
    }
];
