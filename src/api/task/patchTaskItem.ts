import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as moment from "moment";

import { MetricQuantity } from "../../models/MetricQuantity";
import { TaskItem } from "../../models/TaskItem";
import { errorCodes } from "./_errorCodes";
import { TaskItemSchema } from "./_schema";

export const patchTaskItem = [{
    method: "PATCH",
    path: "/api/v1/tasks/{taskUid}/items/{itemUid}",
    handler: patchTaskItemHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Patch TaskItem",
        tags: ["api", "patch", "v1", "item"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().keys({
                name: Joi.string().optional(),
                desc: Joi.string().optional().allow(null),
                period: Joi.array().allow(null).items(
                    Joi.date().iso().required()
                ).length(2).optional(),
                metrics: Joi.array().items(
                    Joi.object().keys({
                        uid: Joi.string().required(),
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

async function patchTaskItemHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const {
        period,
        metrics
    } = request.payload as any;

    // check period
    if (period && period !== null) {
        const [fromAt, toAt] = period;

        if (moment(fromAt).isAfter(toAt) === true) {
            throw Boom.badRequest(errorCodes.INVALID_TIME_PERIOD);
        }
    }

    // Patch task item
    const taskItem = await TaskItem.find({
        where: {
            uid: request.params.itemUid
        }
    });

    if (!taskItem) {
        throw Boom.notFound();
    }

    const updatedTaskItem = await taskItem.update({
        ...request.payload as any
    });

    // Patch task item metrics
    if (metrics) {
        for (const metric of metrics) {
            await MetricQuantity.update(
                {
                    quantity: metric.quantity
                },
                {
                    where: {
                        uid: metric.uid
                    }
                }
            );
        }
    }

    return updatedTaskItem.fullPublicJsonObject();

}
