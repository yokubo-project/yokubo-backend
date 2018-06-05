import * as bunyan from "bunyan"; // tsd definitions get loaded.

import { Writable } from "stream";
import Config from "../Config";
import { IRecipient, sendMail } from "./mail";

class EmailErrorStream extends Writable {

    public recipients: IRecipient[];
    public subject: string;
    public html: string;

    constructor() {
        super();
        this.recipients = [{ address: Config.logging.mailReceiver }];
        this.subject = "Received fatal error";
    }

    // tslint:disable-next-line:function-name
    public async _write(entry: string) {
        const html = `<html><body><p>${entry.toString()}</p></body></html>`;
        await sendMail(this.subject, html, this.recipients);
    }

}

const log = bunyan.createLogger({
    name: Config.logging.name,
    streams: [
        {
            type: "rotating-file",
            path: Config.logging.filePath,
            level: Config.logging.fileSeverity as any,
            period: Config.logging.fileRoatationPeriod,
            count: Config.logging.fileCount
        },
        {
            stream: process.stdout,
            level: Config.logging.consoleSeverity as any
        },
        {
            stream: new EmailErrorStream(),
            level: Config.logging.mailSeverity as any
        }
    ]
});

// tslint:disable-next-line:no-default-export
export default log;
