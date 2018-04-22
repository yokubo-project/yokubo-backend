import * as Hapi from "hapi";
import * as Joi from "joi";
import * as Boom from "boom";
import * as _ from "lodash";

import { Task } from "../../models/Task";
import { FullTaskSchema } from "./_schema";

export const patchTask = [{
    method: "PATCH",
    path: "/api/v1/tasks/{taskUid}",
    handler: patchTaskHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Patch task",
        tags: ["api", "patch", "v1", "task"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().keys({
                name: Joi.string().optional(),
                imageUid: Joi.string().optional()
            })
        },
        response: {
            schema: FullTaskSchema
        },
    }
}];

async function patchTaskHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const { imageUid, ...restPayload } = request.payload as any;

    const task = await Task.find({
        where: {
            uid: request.params.taskUid,
        }
    });

    if (!task) {
        throw Boom.notFound();
    }

    const payload = _.extend({},
        imageUid && imageUid !== null ? { ImageUid: imageUid } : null,
        restPayload
    );
    await task.update(payload);

    return task.fullPublicJsonObject();

}
