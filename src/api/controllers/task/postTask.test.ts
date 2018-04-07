import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../../test/chaiRequest";
import { accessToken1, image1 } from "../../../test/fixture";
import { purify } from "../../../test/purify";

describe("POST /v1/task", function () {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `task.snap`);

    it("should post task", async () => {

        const payload = {
            name: "Running",
            imageUid: image1.uid
        };

        const res = await chaiRequest("POST", `/v1/tasks`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "postTask");

    });

    it("should post task with metrics", async () => {

        const payload = {
            name: "Running",
            imageUid: image1.uid,
            metrics: [
                {
                    name: "Distance",
                    unit: "Miles"
                },
                {
                    name: "Energy",
                    unit: "Calories"
                }
            ]
        };
        const res = await chaiRequest("POST", `/v1/tasks`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "postTaskWithMetrics");

    });

});
