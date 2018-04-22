import * as Hapi from "hapi";
import * as Joi from "joi";

import { User } from "../../shared/models/User";
import { Task } from "../../shared/models/Task";
import { FullTaskSchema } from "./_schema";

export const getTasks = [{
    method: "GET",
    path: "/api/v1/tasks",
    handler: getTasksHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Get tasks for the requesting user",
        tags: ["api", "get", "v1", "tasks"],
        response: {
            schema: Joi.array().items(FullTaskSchema).required()
        },
    }
}];

async function getTasksHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const user: User = (request.auth.credentials as any).user;
    const tasks = await user.$get("Tasks") as Task[];

    return Promise.map(tasks, async (task) => {
        return task.fullPublicJsonObject();
    });

}
