import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../util/chaiRequest";
import { accessToken1, task1 } from "../../test/fixture";
import { purify } from "../../util/purify";

describe("POST /api/v1/tasks/{taskUid}/metrics", function () {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `task.snap`);

    it("should post task metric", async () => {

        const payload = {
            name: "Distance",
            unit: "Miles"
        };

        const res = await chaiRequest("POST", `/api/v1/tasks/${task1.uid}/metrics`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "postTaskMetric");

    });

});
