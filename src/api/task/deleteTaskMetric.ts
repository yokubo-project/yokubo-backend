import * as Boom from "boom";
import * as Hapi from "hapi";

import { TaskMetric } from "../../models/TaskMetric";
import { TaskMetricSchema } from "./_schema";

export const deleteTaskMetric = [{
    method: "DELETE",
    path: "/api/v1/tasks/{taskUid}/metrics/{metricUid}",
    handler: deleteTaskMetricHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Delete task",
        tags: ["api", "delete", "v1", "task"],
        validate: {
            options: {
                abortEarly: false
            }
        },
        response: {
            schema: TaskMetricSchema
        }
    }
}];

async function deleteTaskMetricHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const taskMetric = await TaskMetric.find({
        where: {
            uid: request.params.metricUid
        }
    });

    if (!taskMetric) {
        throw Boom.notFound();
    }

    await taskMetric.destroy();

    return taskMetric.publicJsonObject();

}
