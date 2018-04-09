import log from "./log";
import Config from "../Config";

const SparkPost = require("sparkpost");

const options = {
    endpoint: Config.mailing.endpoint
  };
const client = new SparkPost(Config.mailing.apiKey, options);

export interface Recipient {
    address: string;
}

export async function sendMail(subject: string, html: string, recipients: Recipient[]) {

    try {

        const res = await client.transmissions.send({
            options: {
                sandbox: false
            },
            content: {
                from: Config.mailing.from,
                subject,
                html
            },
            recipients
        });

        return(res);

    } catch (err) {

        log.error(`Error: Unable to send mail. Reason: ${err.toString()}`);
        throw err;

    }

}
