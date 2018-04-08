import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Joi from "joi";

import { MetricQuantitySchema } from "./_schema";
import { MetricQuantity } from "../../../shared/models/MetricQuantity";

export const patchMetricQuantity = [{
    method: "PATCH",
    path: "/v1/tasks/{taskUid}/quantities/{quantityUid}",
    handler: patchMetricQuantityHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Patch MetricQuantity",
        tags: ["api", "patch", "v1", "metric"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().keys({
                quantity: Joi.number().required()
            })
        },
        response: {
            schema: MetricQuantitySchema
        },
    }
}];

async function patchMetricQuantityHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const quantity = await MetricQuantity.find({
        where: {
            uid: request.params.quantityUid,
        }
    });

    if (!quantity) {
        throw Boom.notFound();
    }

    const updatedTask = await quantity.update({
        ...request.payload as any
    });

    return updatedTask.fullPublicJsonObject();

}
