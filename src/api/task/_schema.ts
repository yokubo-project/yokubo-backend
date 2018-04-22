import * as Joi from "joi";

import { ImageSchema } from "../user/_schema";

export const TaskSchema = Joi.object().keys({
    uid: Joi.string().guid().length(36).required(),
    name: Joi.string().required(),
    createdAt: Joi.date().iso().required()
}).label("TaskSchema");

export const TaskMetricSchema = Joi.object().keys({
    uid: Joi.string().guid().length(36).required(),
    name: Joi.string().required(),
    unit: Joi.string().required(),
    createdAt: Joi.date().iso().required()
}).label("TaskMetricSchema");

export const MetricQuantitySchema = Joi.object().keys({
    uid: Joi.string().guid().length(36).required(),
    quantity: Joi.number().required(),
    createdAt: Joi.date().iso().required(),
    metric: TaskMetricSchema.required()
}).label("MetricQuantitySchema");

export const TaskItemSchema = Joi.object().keys({
    uid: Joi.string().guid().length(36).required(),
    name: Joi.string().required(),
    desc: Joi.string().required().allow(null),
    period: Joi.array().allow(null).items(Joi.date().iso().required()).length(2).required().allow(null),
    createdAt: Joi.date().iso().required(),
    metricQuantities: Joi.array().items(MetricQuantitySchema).required()
}).label("TaskItemSchema");

export const FullTaskSchema = TaskSchema.keys({
    image: ImageSchema.required(),
    metrics: Joi.array().items(TaskMetricSchema).required(),
    items: Joi.array().items(TaskItemSchema).required()
}).label("FullTaskSchema");
