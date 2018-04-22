import * as Hapi from "hapi";
import * as Joi from "joi";

import { TaskMetric } from "../../models/TaskMetric";
import { TaskMetricSchema } from "./_schema";

export const postTaskMetric = [{
    method: "POST",
    path: "/api/v1/tasks/{taskUid}/metrics",
    handler: postTaskMetricHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Post TaskMetric",
        tags: ["api", "post", "v1", "metric"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().keys({
                name: Joi.string().required(),
                unit: Joi.string().required(),
            })
        },
        response: {
            schema: TaskMetricSchema
        },
    }
}];

async function postTaskMetricHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {


    const taskMetric = await TaskMetric.create({
        ...request.payload as any,
        TaskUid: request.params.taskUid
    });

    return taskMetric.publicJsonObject();

}
