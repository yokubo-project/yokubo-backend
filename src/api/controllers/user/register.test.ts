import { expect } from "chai";
import * as path from "path";

import { purify } from "../../../test/purify";
import chaiRequest from "../../../test/chaiRequest";
import { user1 } from "../../../test/fixture";

describe("POST /v1/auth/register", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `user.snap`);

    it("should register user", async () => {

        const registrationPayload = {
            username: "new-user@test.com",
            password: "somethingNew42!!",
            name: "New User"
        };

        const response = await chaiRequest("POST", "/v1/auth/register").send(registrationPayload);
        expect(response.status).to.be.equal(200);

        const preparedSnapshot = purify(response.body, ["refreshToken", "accessToken"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "registration");

    });

    it("should fail registerring already existing user", async () => {

        const registrationPayload = {
            username: user1.username,
            password: "somethingNew42!!",
            name: "New User"
        };
        const response = await chaiRequest("POST", "/v1/auth/register").send(registrationPayload);

        expect(response.status).to.be.equal(400);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "failRegistrationWithExistingUser");

    });

    it("should fail registering new user as pwd is to weak", async () => {

        const registrationPayload = {
            username: "new-user@test.com",
            password: "weak",
            name: "New User"
        };
        const response = await chaiRequest("POST", "/v1/auth/register").send(registrationPayload);

        expect(response.status).to.be.equal(400);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "failRegistrationPwdToWeak");

    });

    it("should fail registering new user with invalid email", async () => {

        const registrationPayload = {
            username: "not an email",
            password: "weak",
            name: "New User"
        };
        const response = await chaiRequest("POST", "/v1/auth/register").send(registrationPayload);

        expect(response.status).to.be.equal(400);
        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "failRegistrationWithNonValidEmail");

    });

});
