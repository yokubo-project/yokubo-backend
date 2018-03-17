import { Sequelize } from "sequelize-typescript";

import Config from "../Config";

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
