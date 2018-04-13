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

        return client.transmissions.send({
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

    } catch (err) {

        // No logging of possible error as logger could try to send mail which may again produce error and so on
        // TODO: USe different channel to inform mailing is not possible

    }

}
