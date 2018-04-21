import * as path from "path";

const packageJson = require("../../../package.json");

if (!process.env.NODE_ENV) {
    console.error("Error: NODE_ENV not set! Exiting process ...");
    process.exit(1);
}

if (process.env.NODE_ENV === "test") {
    require("dotenv").config({path: path.join(__dirname, "../../../env/test.env")});
} else {
    require("dotenv").config({path: path.join(__dirname, "../../../env/prod.env")});
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
    fileRoatationPeriod: string;
    fileCount: number;
    consoleSeverity: string;
    mailSeverity: string;
    mailReceiver: string;
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

interface IMailing {
    endpoint: string;
    apiKey: string;
    from: string;
}

interface IStaticWebpages {
    forgotPwdLink: string;
}

interface ITest {
    sendMails: boolean;
    user1Email: string;
    user2Email: string;
}

interface IAdmin {
    username: string;
    password: string;
    name: string;
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
        fileRoatationPeriod: "1d",
        fileCount: 14,
        consoleSeverity: process.env.CONSOLE_SEVERITY || "info",
        mailSeverity: process.env.MAIL_SEVERITY || "fatal",
        mailReceiver: process.env.MAIL_RECEIVER || "mail@localhost.com"
    };

    // Auth
    static auth: IAuth = {
        zxcvbnScore: 2,
        bcryptSaltRounds: 10,
        tokenExpiresIn: 86400000, // 24 hours
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

    // Mailing
    static mailing: IMailing = {
        endpoint: "https://api.eu.sparkpost.com:443",
        apiKey: process.env.MAIL_API_KEY || "",
        from: process.env.MAIL_FROM || "mailing@localhost.com"
    };

    // Static pages
    static pages: IStaticWebpages = {
        forgotPwdLink: `${process.env.STATIC_WEBPAGES_URL_HOST}/views/v1/pwd-reset-form/`
    };

    // Test
    static test: ITest = {
        sendMails: process.env.SEND_TEST_MAILS === "true" || false,
        user1Email: process.env.TESTUSER_1_EMAIL || "user1@test.com",
        user2Email: process.env.TESTUSER_2_EMAIL || "user2@test.com"
    };

    // Admin user
    static admin: IAdmin = {
        username: process.env.ADMIN_USERNAME || "admin",
        password: process.env.ADMIN_PWD || "password",
        name: process.env.ADMIN_NAME || "Administrator"
    };

}

export default Config;
