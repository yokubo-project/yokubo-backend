import { expect } from "chai";
import * as path from "path";

import { purify } from "../../../test/purify";
import chaiRequest from "../../../test/chaiRequest";
import { accessToken1 } from "../../../test/fixture";

describe("POST /v1/auth/resetpwd", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `resetpwd.snap`);

    it("should reset pwd", async () => {

        const response = await chaiRequest("POST", "/v1/auth/resetpwd", accessToken1.token).send({
            currentPwd: "mynewpwd42",
            newPwd: "What3ver!1!$"
        });

        expect(response.status).to.be.equal(200);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "resetpwd");

    });

    it("should fail resetting pwd as new and current one do not match", async () => {

        const response = await chaiRequest("POST", "/v1/auth/resetpwd", accessToken1.token).send({
            currentPwd: "wrongpwd24",
            newPwd: "What3ver!1!$"
        });

        expect(response.status).to.be.equal(400);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "resetpwdNotMatchingError");

    });

    it("should fail as new pwd is to weak", async () => {

        const response = await chaiRequest("POST", "/v1/auth/resetpwd", accessToken1.token).send({
            currentPwd: "mynewpwd42",
            newPwd: "weak"
        });

        expect(response.status).to.be.equal(400);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "resetpwdWeakError");

    });

});
