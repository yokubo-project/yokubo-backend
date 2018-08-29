import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as moment from "moment";

import { MetricQuantity } from "../../models/MetricQuantity";
import { TaskItem } from "../../models/TaskItem";
import { errorCodes } from "./_errorCodes";
import { TaskItemSchema } from "./_schema";

export const postTaskItem = [{
    method: "POST",
    path: "/api/v1/tasks/{taskUid}/items",
    handler: postTaskItemHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Post TaskItem",
        tags: ["api", "post", "v1", "item"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().keys({
                name: Joi.string().required(),
                desc: Joi.string().optional().allow(null),
                period: Joi.array().allow(null).items(
                    Joi.date().iso().required()
                ).length(2).optional(),
                metrics: Joi.array().items(
                    Joi.object().keys({
                        TaskMetricUid: Joi.string().required(),
                        quantity: Joi.number().required()
                    }).optional()
                ).optional()
            })
        },
        response: {
            schema: TaskItemSchema
        }
    }
}];

async function postTaskItemHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const {
        period,
        metrics,
        ...restPayload
    } = request.payload as any;

    // check period
    if (period && period !== null) {
        const [fromAt, toAt] = period;

        if (moment(fromAt).isAfter(toAt) === true) {
            throw Boom.badRequest(errorCodes.INVALID_TIME_PERIOD);
        }
    }

    const taskItem = await TaskItem.create({
        period,
        ...restPayload,
        TaskUid: request.params.taskUid
    });

    if (metrics) {
        for (const metric of metrics) {
            await MetricQuantity.create({
                TaskItemUid: taskItem.uid,
                TaskMetricUid: metric.TaskMetricUid,
                quantity: metric.quantity
            });
        }
    }

    return taskItem.fullPublicJsonObject();

}
