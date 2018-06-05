import { expect } from "chai";
import * as path from "path";

import { PwdResetToken } from "../../models/PwdResetToken";
import { user1, user2 } from "../../test/fixture";
import chaiRequest from "../../util/chaiRequest";
import { purify } from "../../util/purify";

describe("POST /api/v1/auth/forgotpwd", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../snapshots/user.snap");

    it("should create new pwdResetToken for user1", async () => {

        const response = await chaiRequest("POST", "/api/v1/auth/forgotpwd").send({
            username: user1.username
        });

        expect(response.status).to.be.equal(200);
        const preparedSnapshot = purify(response.body, ["validUntil"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "getNewPwdToken");

        const pwdResetTokens = await PwdResetToken.findAll({ where: { UserUid: user1.uid } });
        // tslint:disable-next-line:no-unused-expression
        pwdResetTokens && expect(pwdResetTokens.length).to.be.equal(2); // new one and expired one

    });

    it("should return existing pwdResetToken for user2", async () => {

        const response = await chaiRequest("POST", "/api/v1/auth/forgotpwd").send({
            username: user2.username
        });

        expect(response.status).to.be.equal(200);
        const preparedSnapshot = purify(response.body, ["validUntil"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "getExistingPwdToken");

        const pwdResetToken = await PwdResetToken.find({ where: { UserUid: user2.uid } });
        // tslint:disable-next-line:chai-vague-errors
        expect(pwdResetToken).to.not.be.equal(null);

    });

    it("should return fake response as user does not exist", async () => {

        const response = await chaiRequest("POST", "/api/v1/auth/forgotpwd").send({
            username: "john@doe.com"
        });

        const preparedSnapshot = purify(response.body, ["validUntil"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "failGettingPwdTokenAsUserDoesNotExist");

        const pwdResetTokens = await PwdResetToken.findAll({ where: { UserUid: user1.uid } });
        // tslint:disable-next-line:no-unused-expression
        pwdResetTokens && expect(pwdResetTokens.length).to.be.equal(1); // expired one

    });

});
