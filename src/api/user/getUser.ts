import * as Hapi from "hapi";
import { User } from "../../models/User";
import { UserSchema } from "./_schema";

export const getUser = [{
    method: "GET",
    path: "/api/v1/auth/user",
    handler: getUserHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Get user",
        tags: ["api", "get", "v1", "user"],
        response: {
            schema: UserSchema
        },
    }
}];

async function getUserHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const user: User = (request.auth.credentials as any).user;

    return user.publicJsonObject();

}
