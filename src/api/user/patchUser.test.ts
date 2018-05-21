import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../util/chaiRequest";
import { accessToken1, user2 } from "../../test/fixture";

describe.only("PATCH /api/v1/auth/user", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../snapshots/", `user.snap`);

    it("should patch name of user", async () => {

        const response = await chaiRequest("PATCH", "/api/v1/auth/user", accessToken1.token).send({
            name: "John Doe",
        });

        expect(response.status).to.be.equal(200);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "patchName");

    });

    it("should patch username of user", async () => {

        const response = await chaiRequest("PATCH", "/api/v1/auth/user", accessToken1.token).send({
            username: "john@doe.com",
        });

        expect(response.status).to.be.equal(200);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "patchUsername");

    });

    it("should patch username and name of user", async () => {

        const response = await chaiRequest("PATCH", "/api/v1/auth/user", accessToken1.token).send({
            name: "John Doe",
            username: "john@doe.com",
        });

        expect(response.status).to.be.equal(200);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "patchNameAndUsername");

    });

    it("should fail patching user with invalid email", async () => {

        const response = await chaiRequest("PATCH", "/api/v1/auth/user", accessToken1.token).send({
            username: "not an email",
        });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "failPatchingUserWithNonValidEmail");

    });

    it("should fail patching user if email already exists", async () => {

        const response = await chaiRequest("PATCH", "/api/v1/auth/user", accessToken1.token).send({
            username: user2.username,
        });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "failPatchingUserWithAlreadyExistingEmail");

    });

});
