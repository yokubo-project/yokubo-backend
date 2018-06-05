import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";

import { TaskMetric } from "../../models/TaskMetric";
import { TaskMetricSchema } from "./_schema";

export const patchTaskMetric = [{
    method: "PATCH",
    path: "/api/v1/tasks/{taskUid}/metrics/{metricUid}",
    handler: patchTaskMetricHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Patch TaskMetric",
        tags: ["api", "patch", "v1", "metric"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().keys({
                name: Joi.string().optional(),
                unit: Joi.string().optional()
            })
        },
        response: {
            schema: TaskMetricSchema
        }
    }
}];

async function patchTaskMetricHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const taskMetric = await TaskMetric.find({
        where: {
            uid: request.params.metricUid
        }
    });

    if (!taskMetric) {
        throw Boom.notFound();
    }

    const updatedTaskMetric = await taskMetric.update({
        ...request.payload as any
    });

    return updatedTaskMetric.publicJsonObject();

}
