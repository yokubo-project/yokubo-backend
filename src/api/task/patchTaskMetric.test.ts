import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../util/chaiRequest";
import { taskMetric1, accessToken1, task1 } from "../../test/fixture";
import { purify } from "../../util/purify";

describe("PATCH /api/v1/tasks/{taskUid}/metrics", function () {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `task.snap`);

    it("should patch task metric entity", async () => {

        const payload = {
            name: "New Name",
            unit: "New Metric"
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}/metrics/${taskMetric1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchTaskMetric");

    });

    it("should patch name of task metric entity", async () => {

        const payload = {
            name: "New Name",
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}/metrics/${taskMetric1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);
        expect(res.body.name).to.be.equal(payload.name); // Should be updated accordingly to payload
        expect(res.body.unit).to.be.equal(taskMetric1.unit); // Should have original value

        const preparedSnapshot = purify(res.body, ["createdAt", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchTaskMetricName");

    });

    it("should patch empty object of task metric entity", async () => {

        const payload = {
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}/metrics/${taskMetric1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);
        expect(res.body.name).to.be.equal(taskMetric1.name); // Should have original value
        expect(res.body.unit).to.be.equal(taskMetric1.unit); // Should have original value

        const preparedSnapshot = purify(res.body, ["createdAt", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchTaskMetricWithNoNewValues");

    });

    it("should fail patching non existing task metric", async () => {

        const payload = {
            name: "New Name",
            unit: "New Metric"
        };
        const taskMetricUid = "954f261d-cd52-4070-8e96-b942b4b44a6d";


        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}/metrics/${taskMetricUid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(404);

    });

});
