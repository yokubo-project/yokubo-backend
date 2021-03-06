import * as Boom from "boom";
import * as fs from "fs-extra";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as path from "path";
import * as uuid from "uuid";

const readDirPromisified: any = Promise.promisify(fs.readdir);
const copyFilePromisified: any = Promise.promisify(fs.copy);

import { Transaction } from "sequelize";
import { Image } from "../../models/Image";
import { Task } from "../../models/Task";
import { TaskMetric } from "../../models/TaskMetric";
import { User } from "../../models/User";
import log from "../../util/log";
import sequelize from "../../util/sequelize";
import { FullTaskSchema } from "./_schema";

export const postTask = [{
    method: "POST",
    path: "/api/v1/tasks",
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
                        unit: Joi.string().required()
                    })
                ).optional(),
                imageUid: Joi.string().optional().allow(null)
            })
        },
        response: {
            schema: FullTaskSchema
        }
    }
}];

async function postTaskHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const { name, metrics } = request.payload as any;
    let { imageUid } = request.payload as any;

    if (!imageUid) {
        try {
            const fallbackImages = await readDirPromisified(path.join(__dirname, "../../../../assets/task-backgrounds/"));
            const fallbackImage = fallbackImages[randomNumber(1, fallbackImages.length) - 1]; // choose fallback image randomly

            const uuidv4 = uuid.v4();
            const fallbackImageExtension = fallbackImage.split(".")[fallbackImage.split(".").length - 1];
            const file = `${uuidv4}.${fallbackImageExtension}`;
            const thumbnail = `${uuidv4}.thumbnail.${fallbackImageExtension}`;

            await Promise.all(
                [
                    copyFilePromisified(
                        path.join(__dirname, "../../../../assets/task-backgrounds/", fallbackImage),
                        path.join(__dirname, "../../../../assets/image-uploads/", file)
                    ),
                    copyFilePromisified(
                        path.join(__dirname, "../../../../assets/task-backgrounds/", fallbackImage),
                        path.join(__dirname, "../../../../assets/image-uploads/", thumbnail)
                    )
                ]
            );

            const image = await Image.create({ file });
            imageUid = image.uid;
        } catch (err) {
            log.fatal({ err }, "Unable to use a fallback image");
            Boom.badGateway("CouldNotUseFallbackImage");
        }
    }

    const user: User = (request.auth.credentials as any).user;

    return sequelize.transaction(async (transaction: Transaction) => {

        const createdTask = await Task.create({
            name,
            ImageUid: imageUid,
            UserUid: user.uid
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

function randomNumber(min: number, max: number) {
    // tslint:disable-next-line:insecure-random
    return Math.floor(Math.random() * (max - min + 1) + min);
}
