import * as Hapi from "hapi";
import * as Boom from "boom";

import { Task } from "../../../shared/models/Task";
import { FullTaskSchema } from "./_schema";

export const getTask = [{
    method: "GET",
    path: "/v1/tasks/{taskUid}",
    handler: getTaskHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Get task",
        tags: ["api", "get", "v1", "task"],
        response: {
            schema: FullTaskSchema
        },
    }
}];

async function getTaskHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const task = await Task.find({
        where: {
            uid: request.params.taskUid,
        }
    });

    if (!task) {
        throw Boom.notFound();
    }

    return task.fullPublicJsonObject();

}
