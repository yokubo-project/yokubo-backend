import * as Hapi from "hapi";

import { routes } from "./routes/routes";
import Config from "./../shared/Config";

class Api {

    private server: Hapi.Server;

    constructor() {

        // Create a new Hapi server
        this.server = new Hapi.Server({
            host: Config.host,
            port: Config.port,
            routes: {
                cors: { origin: ["*"] }
            }
        });

    }

    async stop(): Promise<void> {
        await this.server.stop();
    }

    async start(): Promise<Api> {

        await this.server.register(require("hapi-auth-bearer-token"));
        await this.server.register(require("hapi-auth-basic"));
        await this.server.register(require("inert"));

        await this.server.route(routes);

        await this.server.start();

        // tslint:disable-next-line:no-floating-promises
        process.on("SIGINT", () => { this.stop(); });

        // tslint:disable-next-line:no-floating-promises
        process.on("SIGTERM", () => { this.stop(); });

        return this;
    }

}

// Important, especially in production.
// We must try to log ANY uncaughtExceptions before exiting out service.
if (Config.env !== "test") {
    process.on("uncaughtException", function (err) {
        try {
            // logger.fatal(err); // TODO: LOGGER
            console.error("Uncaught Exception: ", err, err.message);
        } catch (e) {
            console.error((new Date).toUTCString() + " uncaughtException:", err.message);
            console.error(err.stack);
            console.error(e);
        }
        process.exit(1); // important, exit the process when uncaught exceptions happen after trying to log them! DON"T modify this lines until you know exactly what you are doing!!!
    });
}

export default Api;
