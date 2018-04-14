import { expect } from "chai";
import * as path from "path";

import { purify } from "../../../test/purify";
import chaiRequest from "../../../test/chaiRequest";
import { pwdResetToken2, pwdResetToken1, user2 } from "../../../test/fixture";
import { User } from "../../../shared/models/User";

describe("POST /v1/auth/setforgottenpwd", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `user.snap`);

    it("should set password", async () => {

        const response = await chaiRequest("POST", "/v1/auth/setforgottenpwd").send({
            newPwd: "What3ver!1!$",
            token: pwdResetToken2.token
        });

        expect(response.status).to.be.equal(200);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "setForgottenPwd");

    });

    it("should fail resetting pwd as token is not valid anymore", async () => {

        const response = await chaiRequest("POST", "/v1/auth/setforgottenpwd").send({
            newPwd: "What3ver!1!$",
            token: pwdResetToken1.token
        });

        expect(response.status).to.be.equal(404);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "setForgottenPwdErrorInvalidToken");

    });

    it("should fail setting password if too weak", async () => {

        const response = await chaiRequest("POST", "/v1/auth/setforgottenpwd").send({
            newPwd: "weak",
            token: pwdResetToken2.token
        });

        expect(response.status).to.be.equal(400);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "setForgottenPwdErrorTooWeak");

    });

    it("should fail setting password if user does not exist anymore", async () => {

        const token = pwdResetToken2.token;
        await User.destroy({where: {
            uid: user2.uid
        }}); // Delete user from db

        const response = await chaiRequest("POST", "/v1/auth/setforgottenpwd").send({
            newPwd: "weak",
            token
        });

        expect(response.status).to.be.equal(404);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "setForgottenPwdErrorUserNotFound");

    });

});
