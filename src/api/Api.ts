import * as Hapi from "hapi";
import * as Joi from "joi";
import * as moment from "moment";

import { routes } from "./routes";
import Config from "./../shared/Config";
import log from "../shared/util/log";

import { AccessToken } from "../shared/models/AccessToken";
import { User } from "../shared/models/User";

class Api {

    private server: Hapi.Server;

    constructor() {

        // Create a new Hapi server
        log.info("Creating new Hapi Server");
        this.server = new Hapi.Server({
            host: Config.host,
            port: Config.port,
            routes: {
                cors: { origin: ["*"] }
            }
        });

    }

    async stop(): Promise<void> {

        log.info("Stopping Hapi server");
        log.debug("Stopping server");
        await this.server.stop();

    }

    async start(): Promise<Api> {

        log.debug("Registering plugins");
        await this.server.register(require("hapi-auth-bearer-token"));
        await this.server.register(require("hapi-auth-basic"));
        await this.server.register(require("inert"));

        this.server.auth.strategy("default", "bearer-access-token", {
            validate: async (request: Hapi.Request, token: string, h: any) => {

                Joi.assert(token, Joi.string().guid().length(36));

                const accessToken = await AccessToken.findOne({
                    where: {
                        token: token,
                        validUntil: {
                            $gte: moment.now()
                        }
                    },
                    include: [User]
                });

                if (!accessToken) {
                    return { isValid: false, token, artifacts: {} };
                }

                const credentials = {
                    accessToken,
                    scope: "default_user",
                    user: accessToken.User
                };
                return { isValid: true, credentials, artifacts: {} };
            }

        });
        this.server.auth.default("default");


        log.debug("Registering routes");
        await this.server.route(routes);

        log.info(`Starting Hapi server at ${Config.host}:${Config.port}`);
        await this.server.start();

        log.debug("Registering event");
        // tslint:disable-next-line:no-floating-promises
        process.on("SIGINT", () => { this.stop(); });
        // tslint:disable-next-line:no-floating-promises
        process.on("SIGTERM", () => { this.stop(); });

        return this;
    }

}

// Log uncaughtExceptions and exit service as we don't know in which state service is
if (Config.env !== "test") {
    process.on("uncaughtException", function (err) {
        log.fatal(err, "Got uncaught exception");
        process.exit(1);
    });
}

export default Api;
