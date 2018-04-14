import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../../test/chaiRequest";
import { accessToken1, user1Pwd } from "../../../test/fixture";

describe("DELETE /v1/auth/user", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `user.snap`);

    it("should delete user", async () => {

        const response = await chaiRequest("DELETE", "/v1/auth/user", accessToken1.token).send({
            currentPwd: user1Pwd,
        });

        expect(response.status).to.be.equal(200);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "deleteUser");

    });

    it("should fail patching user using wrong password", async () => {

        const response = await chaiRequest("DELETE", "/v1/auth/user", accessToken1.token).send({
            currentPwd: "wrong",
        });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "failToDeleteUserWithWrongPwd");

    });

});
