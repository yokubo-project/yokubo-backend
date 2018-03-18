const packageJson = require("../../../package.json");

if (!process.env.NODE_ENV) {
    console.error("Error: NODE_ENV not set! Exiting process ...");
    process.exit(1);
}

interface IDatabase {
    dialect: string;
    host: string;
    port: string;
    username: string;
    password: string;
    dbname: string;
    native: boolean;
}

interface ILogging {
    name: string;
    fileSeverity: string;
    filePath: string;
    consoleSeverity: string;
}

interface IAuth {
    zxcvbnScore: number;
    bcryptSaltRounds: number;
    tokenExpiresIn: number;
}

class Config {

    static env: string = process.env.NODE_ENV || "test";

    static host: string = process.env.SERVER_HOST || "0.0.0.0";
    static port: string = process.env.SERVER_PORT || "8000";

    // Sequelize config
    static database: IDatabase = {
        dialect: "postgres",
        host: process.env.PGHOST || "127.0.0.1",
        port: process.env.PGPORT || "5432",
        username: process.env.PGUSER || "dbuser",
        password: process.env.PGPASSWORD || "dbpwd",
        dbname: process.env.PGDATABASE || "yokubo",
        native: true
    };

    // Bunyan config
    static logging: ILogging = {
        name: packageJson.name,
        fileSeverity: process.env.FILE_SEVERITY || "error",
        filePath: process.env.FILE_PATH || `./${packageJson.name}.log`,
        consoleSeverity: process.env.CONSOLE_SEVERITY || "info"
    };

    static auth: IAuth = {
        zxcvbnScore: 2,
        bcryptSaltRounds: 10,
        tokenExpiresIn: 86400000 // 24 hours
    };

}

export default Config;