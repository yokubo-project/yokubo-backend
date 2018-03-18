import { Sequelize } from "sequelize-typescript";

import log from "./log";
import Config from "../Config";

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
    timezone: "Etc/UTC"
});

export default sequelize;
