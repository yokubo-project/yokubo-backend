import * as path from "path";

export const assets = [{
    method: "GET",
    path: "/v1/assets/{param*}",
    handler: {
        directory: {
            path: path.join(__dirname, "../../../../../assets/")
        }
    },
    config: {
        auth: false,
        description: "Static file serving",
        tags: ["api", "get", "v1", "user", "assets"],
    }
}];
