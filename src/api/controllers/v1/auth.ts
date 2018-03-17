// import * as Boom from 'boom';
import * as Hapi from "hapi";
// import * as _ from 'lodash';

export async function register(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    return JSON.stringify({ result: "working" });

}
