import { expect } from "chai";

import { uids } from "../fixture";
import { User } from "../../shared/models/User";


describe("POST /api/v1/auth/register", () => {

    it("should register user", async () => {

        // TODO: Configure chai-http

        const user = <User>await User.findById(uids.user1);
        expect(user.uid).to.be.equal(uids.user1);

    });

});
