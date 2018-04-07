import * as Hapi from "hapi";
import * as Joi from "joi";

import { Task } from "../../../shared/models/Task";
import { FullTaskSchema } from "./_schema";
import { User } from "../../../shared/models/User";
import { Transaction } from "sequelize";
import sequelize from "../../../shared/util/sequelize";
import { TaskMetric } from "../../../shared/models/TaskMetric";

export const postTask = [{
    method: "POST",
    path: "/v1/tasks",
    handler: postTaskHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Post task",
        tags: ["api", "post", "v1", "task"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().keys({
                name: Joi.string().required(),
                metrics: Joi.array().items(
                    Joi.object().keys({
                        name: Joi.string().required(),
                        unit: Joi.string().required(),
                    })
                ).optional(),
                imageUid: Joi.string().required(),
            })
        },
        response: {
            schema: FullTaskSchema
        },
    }
}];

async function postTaskHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const { name, imageUid, metrics } = request.payload as any;
    const user: User = (request.auth.credentials as any).user;
    return sequelize.transaction(async (transaction: Transaction) => {

        const createdTask = await Task.create({
            name,
            ImageUid: imageUid,
            UserUid: user.uid,
        });

        if (metrics) {
            for (const metric of metrics) {
                await TaskMetric.create({
                    ...metric,
                    TaskUid: createdTask.uid
                });
            }
        }

        return createdTask.fullPublicJsonObject();

    });

}
