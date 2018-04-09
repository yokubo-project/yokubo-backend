import { expect } from "chai";
import { sendMail } from "./mail";

describe("mail", function () {

    it("send test mail", async () => {

        if (process.env.SEND_TEST_MAILS) {
            const subject = "Hello, World!";
            const html = "<html><body><p>Testing SparkPost - the world's most awesomest email service!</p></body></html>";
            const recipients = [{
                address: "markus.hoesel@gmx.at"
            }];
        
            const res = await sendMail(subject, html, recipients);
            expect(res.results.total_accepted_recipients).to.be.equal(1);
            expect(res.results.total_rejected_recipients).to.be.equal(0);    
        }
        
    });

});
