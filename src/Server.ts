import * as Hapi from "hapi";
import * as Joi from "joi";
import * as moment from "moment";
import * as path from "path";
const HapiReactViews = require("hapi-react-views");

import { routes as ApiRoutes } from "./api/routes";
import { routes as ViewRoutes } from "./views/routes";
import Config from "./Config";
import log from "./util/log";

import { AccessToken } from "./models/AccessToken";
import { User } from "./models/User";
import { preventTimingAttack } from "./util/helpers";

const packageJson = require("../../package.json");

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
        await this.server.register(require("inert")); // Static file serving
        await this.server.register(require("hapi-auth-bearer-token")); // Authentication
        await this.server.register(require("hapi-auth-basic")); // Authentication for Swagger
        await this.server.register(require("vision")); // Template rendering for Swagger

        this.server.auth.strategy("bearer", "bearer-access-token", {
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
                    return { isValid: false, credentials: { accessToken }, artifacts: {} };
                }

                const credentials = {
                    accessToken,
                    scope: "default_user",
                    user: accessToken.User
                };
                return { isValid: true, credentials, artifacts: {} };
            }

        });

        // Basic strategy is only used for admin tools
        this.server.auth.strategy("simple", "basic", {
            validate: async (request: Hapi.Request, username: string, password: string, h: any) => {

                const user = await User.findOne({ where: { username } });
                if (!user || user.isAdmin === false) {
                    return { credentials: null, isValid: false };
                }
                if (!await User.comparePassword(password, user.password)) {
                    await preventTimingAttack();
                    return { credentials: null, isValid: false };
                }

                const credentials = {
                    scope: "admin_user", // admin scope
                    user: user
                };
                return { isValid: true, credentials };

            }
        });

        await this.server.register({
            plugin: require("hapi-swagger"),
            options: {
                auth: "simple", // Require authentication to access Swagger documentation
                info: {
                    title: "Yokubo API Documentation",
                    version: packageJson.version,
                },
                securityDefinitions: { // Add a Bearer Token field to the header in order to be able to perform authorized request
                    "default": {
                        type: "apiKey",
                        name: "Authorization",
                        in: "header",
                        "x-keyPrefix": "Bearer "
                    },
                },
                security: [{ "default": [] }],
            }
        } as any);

        await this.server.register({
            plugin: require("good"),
            options: {
                ops: {
                    interval: 1000 * 60 // every minute
                },
                includes: {
                    request: ["headers", "payload"],
                    response: ["payload"]
                },
                reporters: {
                    bunyan: [{
                        module: "good-bunyan",
                        args: [
                            { ops: "*", response: "*", log: "*", error: "*", request: "*" },
                            {
                                logger: log,
                                levels: {
                                    error: "fatal",
                                    log: "info",
                                    ops: "info",
                                    request: "debug",
                                    response: "debug"
                                },
                                formatters: {
                                    error: (data: any): any => {
                                        return [data, `ERROR ${data.url.path}`];
                                    },
                                    request: (data: any): any => {
                                        return [data, `<-- ${data.path}`];
                                    },
                                    response: (data: any): any => {
                                        return [data, `--> ${data.path}`];
                                    }
                                }
                            }
                        ]
                    }]
                }
            }
        } as any);

        await (this.server as any).views({
            engines: {
                js: HapiReactViews
            },
            relativeTo: path.join(__dirname),
            path: "views",
            compileOptions: {
                renderMethod: "renderToString"
            }
        });

        this.server.auth.default("bearer");

        log.debug("Registering api routes");
        await this.server.route([].concat(...ApiRoutes, ...ViewRoutes));

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
process.on("uncaughtException", function (err) {
    log.fatal(err, "Got uncaught exception");
    process.exit(1);
});
process.on("unhandledRejection", function (err) {
    log.fatal(err, "Got uncaught exception");
});


export default Api;
