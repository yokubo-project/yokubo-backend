import * as Hapi from "hapi";
import * as Boom from "boom";

// import { User } from "../../../shared/models/User";
import { Task } from "../../../shared/models/Task";
import { FullTaskSchema } from "./_schema";

export const deleteTask = [{
    method: "DELETE",
    path: "/v1/tasks/{taskUid}",
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

    // const user: User = (request.auth.credentials as any).user;
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
