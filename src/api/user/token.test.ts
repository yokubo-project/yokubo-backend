import { expect } from "chai";
import * as path from "path";

import { purify } from "../../test/purify";
import chaiRequest from "../../test/chaiRequest";
import { user1, user1Pwd, refreshToken1 } from "../../test/fixture";

describe("POST /api/v1/auth/token", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../snapshots/", `user.snap`);

    it("should get token using password", async () => {

        const response = await chaiRequest("POST", "/api/v1/auth/token").send({
            grantType: "password",
            username: user1.username,
            password: user1Pwd
        });

        expect(response.status).to.be.equal(200);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "getTokenViaPwd");

    });

    it("should fail getting token using wrong password", async () => {

        const response = await chaiRequest("POST", "/api/v1/auth/token").send({
            grantType: "password",
            username: user1.username,
            password: "whatever"
        });

        expect(response.status).to.be.equal(400);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "failToGetTokenWithWrongPwd");

    });

    it("should fail getting token using non existing user", async () => {

        const response = await chaiRequest("POST", "/api/v1/auth/token").send({
            grantType: "password",
            username: "idonotexist@text.com",
            password: "whatever"
        });

        expect(response.status).to.be.equal(400);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "failToGetTokenWithNonExistingUser");

    });

    it("should get token using refreshToken", async () => {

        const response = await chaiRequest("POST", "/api/v1/auth/token").send({
            grantType: "refreshToken",
            refreshToken: refreshToken1.token,
        });

        expect(response.status).to.be.equal(200);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "getTokenViaRefreshToken");

    });
    
    it("should fail getting token using invalid refreshToken", async () => {

        const response = await chaiRequest("POST", "/api/v1/auth/token").send({
            grantType: "refreshToken",
            refreshToken: "12deb8d6-5b27-4368-a212-93c89f7bfad7",
        });

        expect(response.status).to.be.equal(400);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "failToGetTokenViaRefreshToken");

    });

});
