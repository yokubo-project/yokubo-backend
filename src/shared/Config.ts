import * as path from "path";

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

interface IAssets {
    imageUploadsPath: string;
    imageUploadsRelativeUrl: string;
    externalUrl: string;
}

interface IImageUpload {
    supportedExtensions: string[];
    supportedMimeTypes: string[];
    maxUpload: number;
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

    // Auth
    static auth: IAuth = {
        zxcvbnScore: 2,
        bcryptSaltRounds: 10,
        tokenExpiresIn: 86400000 // 24 hours
    };

    // Assets
    static assets: IAssets = {
        imageUploadsPath: path.join(__dirname, "../../../assets/image-uploads/"),
        imageUploadsRelativeUrl: "/v1/assets/image-uploads/",
        externalUrl: process.env.EXTERNAL_ASSETS_URL_HOST || "127.0.0.1:8080"
    };

    // ImageUpload
    static imageUpload: IImageUpload = {
        supportedExtensions: ["png", "jpg", "jpeg"],
        supportedMimeTypes: ["image/jpeg", "image/png"],
        maxUpload: 20 * 1024 * 1024
    };

}

export default Config;
