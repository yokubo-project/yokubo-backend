import { expect } from "chai";

describe("polyfills", () => {

    it("check if bluebird promise is used globally", () => {

        expect(Promise).to.be.equal(require("bluebird"));
        expect(Promise.resolve()).to.be.instanceof(require("bluebird"));

    });

    it("check if node-fetch is used globally", () => {

        expect(fetch).to.be.equal(require("node-fetch"));

    });

});
