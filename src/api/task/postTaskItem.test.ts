import { expect } from "chai";
import * as path from "path";
import * as moment from "moment";

import chaiRequest from "../../util/chaiRequest";
import { accessToken1, task1, taskMetric1, taskMetric2 } from "../../test/fixture";
import { purify } from "../../util/purify";

describe("POST /api/v1/tasks/{taskUid}/items", function () {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `task.snap`);

    it("should post task item", async () => {

        const fromAt = moment().subtract(7, "hours").toISOString();
        const toAt = moment().toISOString();

        const payload = {
            name: "Name of the item",
            desc: "Desc of the item",
            period: [fromAt, toAt],
            metrics: [{
                TaskMetricUid: taskMetric1.uid,
                quantity: 30
            }, {
                TaskMetricUid: taskMetric2.uid,
                quantity: 24.5
            }]
        };

        const res = await chaiRequest("POST", `/api/v1/tasks/${task1.uid}/items`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);
        expect(res.body.period[0]).to.be.equal(fromAt);
        expect(res.body.period[1]).to.be.equal(toAt);

        const preparedSnapshot = purify(res.body, ["createdAt", "uid", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "postTaskItem");

    });

    it("should post task item with name and desc", async () => {

        const payload = {
            name: "Name of the item",
            desc: "Desc of the item",
        };

        const res = await chaiRequest("POST", `/api/v1/tasks/${task1.uid}/items`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "postTaskItemWithNameAndDesc");

    });

    it("should post task item with name, desc and empty metrics array", async () => {

        const payload = {
            name: "Name of the item",
            desc: "Desc of the item",
            metrics: []
        };

        const res = await chaiRequest("POST", `/api/v1/tasks/${task1.uid}/items`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "postTaskItemWithEmptyMetricsArray");

    });

    it("should post task item with name and period", async () => {

        const fromAt = moment().subtract(7, "hours").toISOString();
        const toAt = moment().toISOString();

        const payload = {
            name: "Name of the item",
            period: [fromAt, toAt],
        };

        const res = await chaiRequest("POST", `/api/v1/tasks/${task1.uid}/items`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);
        expect(res.body.period[0]).to.be.equal(fromAt);
        expect(res.body.period[1]).to.be.equal(toAt);

        const preparedSnapshot = purify(res.body, ["createdAt", "uid", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "postTaskItemWithNameAndPeriod");

    });

    it("should post task item with name and metrics", async () => {

        const payload = {
            name: "Name of the item",
            metrics: [{
                TaskMetricUid: taskMetric1.uid,
                quantity: 30
            }, {
                TaskMetricUid: taskMetric2.uid,
                quantity: 24.5
            }]
        };

        const res = await chaiRequest("POST", `/api/v1/tasks/${task1.uid}/items`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "postTaskItemWithNameAndMetric");

    });

    it("should fail posting task item without name", async () => {

        const payload = {
            desc: "Desc of the item",
        };

        const res = await chaiRequest("POST", `/api/v1/tasks/${task1.uid}/items`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(400);

    });
        
});
