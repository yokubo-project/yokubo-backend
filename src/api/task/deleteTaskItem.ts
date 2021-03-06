import * as Boom from "boom";
import * as Hapi from "hapi";

import { TaskItem } from "../../models/TaskItem";
import { TaskItemSchema } from "./_schema";

export const deleteTaskItem = [{
    method: "DELETE",
    path: "/api/v1/tasks/{taskUid}/items/{itemUid}",
    handler: deleteTaskItemHandler,
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
            schema: TaskItemSchema
        }
    }
}];

async function deleteTaskItemHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const taskItem = await TaskItem.find({
        where: {
            uid: request.params.itemUid
        }
    });

    if (!taskItem) {
        throw Boom.notFound();
    }

    await taskItem.destroy();

    return taskItem.fullPublicJsonObject();

}
