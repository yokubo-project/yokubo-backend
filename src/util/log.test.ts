import log from "./log";

describe("log", function () {

    it("should send mail when logging with fatal severity, ", async () => {

        await log.fatal("Testing log stmt of fatal severity"); // This triggers sending of error mail

    });

});
