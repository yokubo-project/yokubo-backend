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
    period: Joi.array().allow(null).items(Joi.date().iso().required()).length(2).required(),
    createdAt: Joi.date().iso().required(),
    metricQuantities: Joi.array().items(MetricQuantitySchema).required(),
    duration: Joi.number().allow(null).description("Duration in seconds")
}).label("TaskItemSchema");

const TaskItemStatsSchema = Joi.object().keys({
    metricKey: Joi.string().required(),
    metricName: Joi.string().required(),
    metricUnit: Joi.string().required(),
    totalItems: Joi.number().required(),
    totalValue: Joi.number().required(),
    averageValue: Joi.number().required(),
    minValue: Joi.number().required(),
    maxValue: Joi.number().required()
});

const ChartDataSchema = Joi.object().keys({
    days: Joi.array().items(
        Joi.object().keys({
            date: Joi.any().required(),
            totalValue: Joi.number().required(),
            metricKey: Joi.string().required(),
            metricName: Joi.string().required(),
            metricUnit: Joi.string().required()
        }).optional()
    ).required(),
    weeks: Joi.array().items(
        Joi.object().keys({
            daterange: Joi.any().required(),
            totalValue: Joi.number().required(),
            metricKey: Joi.string().required(),
            metricName: Joi.string().required(),
            metricUnit: Joi.string().required()
        }).optional()
    ).required(),
    months: Joi.array().items(
        Joi.object().keys({
            daterange: Joi.any().required(),
            totalValue: Joi.number().required(),
            metricKey: Joi.string().required(),
            metricName: Joi.string().required(),
            metricUnit: Joi.string().required()
        }).optional()
    ).required()
});

export const FullTaskSchema = TaskSchema.keys({
    image: ImageSchema.required(),
    metrics: Joi.array().items(TaskMetricSchema).required(),
    items: Joi.array().items(TaskItemSchema).required(),
    stats: Joi.array().items(TaskItemStatsSchema).required(),
    chartData: ChartDataSchema.required()
}).label("FullTaskSchema");
