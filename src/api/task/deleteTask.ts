import * as Hapi from "hapi";
import * as Boom from "boom";

import { Task } from "../../models/Task";
import { FullTaskSchema } from "./_schema";

export const deleteTask = [{
    method: "DELETE",
    path: "/api/v1/tasks/{taskUid}",
    handler: deleteTaskHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Delete task",
        tags: ["api", "delete", "v1", "task"],
        response: {
            schema: FullTaskSchema
        },
    }
}];

async function deleteTaskHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const task = await Task.find({
        where: {
            uid: request.params.taskUid,
        }
    });

    if (!task) {
        throw Boom.notFound();
    }

    await task.destroy();

    return task.fullPublicJsonObject();

}
