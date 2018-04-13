import * as Joi from "joi";

export const ImageSchema = Joi.object().keys({
    uid: Joi.string().guid().length(36).required(),
    file: Joi.string().required().description("an uploaded image file (full url"),
}).label("ImageSchema");

export const Token = Joi.object().required().keys({
    tokenType: Joi.string().required(),
    refreshToken: Joi.string().guid().length(36).required(),
    accessToken: Joi.string().guid().length(36).required(),
    expiresIn: Joi.number().required()
});
