import { expect } from "chai";
import * as path from "path";

import { accessToken1 } from "../../test/fixture";
import chaiRequest from "../../util/chaiRequest";

describe("GET /api/v1/auth/user", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../snapshots/user.snap");

    it("should get user", async () => {

        const response = await chaiRequest("GET", "/api/v1/auth/user", accessToken1.token);

        await Promise.delay(2000);
        expect(response.status).to.be.equal(200);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "getUser");

    });

    it("should fail fetching user using invalid access token", async () => {

        const response = await chaiRequest("GET", "/api/v1/auth/user", "2b266900-96c0-4788-8746-21bd629e4468");

        expect(response.status).to.be.equal(401);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "failToGetUserWithInvalidToken");

    });

});
