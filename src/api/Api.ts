import * as Hapi from "hapi";

import { routes } from "./routes/routes";
import Config from "./../shared/Config";
import log from "../shared/util/log";

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

        log.debug("Registering routes");
        await this.server.route(routes);

        log.info("Starting Hapi server");
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
        try {
            log.fatal("Uncaught Exception: ", err);
        } catch (e) {
            console.error((new Date).toUTCString() + " uncaughtException:", err.message);
            console.error(err.stack);
            console.error(e);
        }
        process.exit(1);
    });
}

export default Api;
