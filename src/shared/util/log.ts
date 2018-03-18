import * as bunyan from "bunyan"; // tsd definitions get loaded.

import Config from "../Config";

const log = bunyan.createLogger({
    name: Config.logging.name,
    streams: [
        {
            path: Config.logging.filePath,
            level: Config.logging.fileSeverity as any
        },
        {
            stream: process.stdout,
            level: Config.logging.consoleSeverity as any
        }
    ]
});

export default log;
