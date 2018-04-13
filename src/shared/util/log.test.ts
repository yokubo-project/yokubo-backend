import log from "./log";

describe("log", function () {

    it("should send mail when logging with fatal severity, ", async () => {

        if (process.env.SEND_TEST_MAILS) {
            await log.fatal("Testing log stmt of fatal severity"); // This triggers sending of error mail
            await Promise.delay(1000); // Delay return so mail can be sent
        }

    });

});
