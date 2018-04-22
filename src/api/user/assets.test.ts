import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../test/chaiRequest";

describe("GET /api/v1/assets", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../snapshots/", `asset.snap`);

    it("should fetch asset", async () => {

        const response = await chaiRequest("GET", "/api/v1/assets/testimage.gif");
        expect(response.status).to.be.equal(200);

        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "fetchAsset");

    });

    it("should fail fetching non existing asset", async () => {

        const response = await chaiRequest("GET", "/api/v1/assets/non-existing.gif");
        expect(response.status).to.be.equal(404);

        expect(response.body).to.matchSnapshot(SNAPSHOT_FILE, "failToFetchNonExistingAsset");

    });

});
