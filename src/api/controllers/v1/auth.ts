import * as Boom from "boom";
import * as Hapi from "hapi";

import { User } from "../../../shared/models/User";

export async function register(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    try {

        const params = request.query as any;

        // Creating new user
        const user = await new User({
            username: params.username,
            password: params.password,
        }).save();

        return JSON.stringify({ result: user.username });

    } catch (err) {

        throw Boom.badRequest("User already exists");

    }

}
