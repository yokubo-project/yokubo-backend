import * as Joi from "joi";

export const ImageSchema = Joi.object().keys({
    uid: Joi.string().guid().length(36).required(),
    file: Joi.string().required().description("an uploaded image file (full url"),
}).label("ImageSchema");
