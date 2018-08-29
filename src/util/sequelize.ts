import * as path from "path";
import { Sequelize } from "sequelize-typescript";

import Config from "../Config";
import log from "./log";

log.debug("Creating sequelize instance");
const sequelize = new Sequelize({
    database: Config.database.dbname,
    dialect: Config.database.dialect,
    username: Config.database.username,
    password: Config.database.password,
    pool: {
        idle: 10000,
        max: 5,
        min: 0
    },
    timezone: "Etc/UTC",
    logging: Config.logging.consoleSeverity === "debug" ? true : false,
    modelPaths: [path.resolve(__dirname, "../models")]
});

export { Transaction } from "sequelize";

// tslint:disable-next-line:no-default-export
export default sequelize;
