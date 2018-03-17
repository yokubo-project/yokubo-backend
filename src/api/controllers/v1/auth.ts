// import * as Boom from 'boom';
import * as Hapi from "hapi";
// import * as _ from 'lodash';
import * as uuid from "uuid";

import { User } from "../../../shared/models/User";

export async function register(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const user = await new User({
        username: `USER_${uuid.v4()}`,
        password: "pwd1",
        // createdAt: "2018-01-01",
        // deletedAt: "2018-01-01"
    }).save();

    return JSON.stringify({ result: user.username });

}
