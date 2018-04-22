import { expect } from "chai";
import * as path from "path";
import * as moment from "moment";

import chaiRequest from "../../util/chaiRequest";
import { accessToken1, task1, taskItem1, metricQuantity1, metricQuantity2 } from "../../test/fixture";
import { purify } from "../../util/purify";

describe("PATCH /api/v1/tasks/{taskUid}/items", function () {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `task.snap`);

    it("should patch task item entity", async () => {

        const payload = {
            name: "New Name",
            desc: "New Desc",
            period: [
                moment().subtract(10, "hours").toISOString(),
                moment().toISOString()
            ],
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}/items/${taskItem1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);
        expect(res.body.name).to.be.equal(payload.name); // Should be updated accordingly to payload
        expect(res.body.desc).to.be.equal(payload.desc); // Should be updated accordingly to payload
        expect(res.body.period[0]).to.be.equal(payload.period[0]); // Should be updated accordingly to payload
        expect(res.body.period[1]).to.be.equal(payload.period[1]); // Should be updated accordingly to payload

        const preparedSnapshot = purify(res.body, ["createdAt", "uid", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchTaskItem");

    });

    it("should patch task item entity with metrics", async () => {

        const updatedMetricQuantity = {
            uid: metricQuantity1.uid,
            quantity: 3333
        };

        const payload = {
            name: "New Name",
            metrics: [updatedMetricQuantity]
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}/items/${taskItem1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);
        expect(res.body.name).to.be.equal(payload.name); // Should be updated accordingly to payload
        expect(res.body.desc).to.be.equal(taskItem1.desc); // Should have original value
        expect(res.body.period[0]).to.be.equal(taskItem1.period[0]); // Should have original value
        expect(res.body.period[1]).to.be.equal(taskItem1.period[1]); // Should have original value

        const metricQuantityRes1 = res.body.metricQuantities.filter((metric: any) => metric.uid === updatedMetricQuantity.uid)[0];
        expect(metricQuantityRes1.quantity).to.be.equal(updatedMetricQuantity.quantity); // Should be updated accordingly to payload

        const metricQuantityRes2 = res.body.metricQuantities.filter((metric: any) => metric.uid === metricQuantity2.uid)[0];
        expect(metricQuantityRes2.quantity).to.be.equal(metricQuantity2.quantity); // Should have original value

        const preparedSnapshot = purify(res.body, ["createdAt", "uid", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchTaskItemWithMetrics");

    });

    it("should patch name of task item entity", async () => {

        const payload = {
            name: "New Name",
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}/items/${taskItem1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);
        expect(res.body.name).to.be.equal(payload.name); // Should be updated accordingly to payload
        expect(res.body.desc).to.be.equal(taskItem1.desc); // Should have original value
        expect(res.body.period[0]).to.be.equal(taskItem1.period[0]); // Should be updated accordingly to payload
        expect(res.body.period[1]).to.be.equal(taskItem1.period[1]); // Should be updated accordingly to payload

        const preparedSnapshot = purify(res.body, ["createdAt", "uid", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchTaskItemName");

    });

    it("should patch empty object of task item entity", async () => {

        const payload = {
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}/items/${taskItem1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);
        expect(res.body.name).to.be.equal(taskItem1.name); // Should have original value
        expect(res.body.desc).to.be.equal(taskItem1.desc); // Should have original value
        expect(res.body.period[0]).to.be.equal(taskItem1.period[0]); // Should have original value
        expect(res.body.period[1]).to.be.equal(taskItem1.period[1]); // Should have original value

        const preparedSnapshot = purify(res.body, ["createdAt", "uid", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchTaskItemWithNoNewValues");

    });

    it("should fail patching non existing task item", async () => {

        const payload = {
            name: "New Name",
            desc: "New Desc"            
        };
        const taskItemUid = "954f261d-cd52-4070-8e96-b942b4b44a6d";

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}/items/${taskItemUid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(404);

        const preparedSnapshot = purify(res.body, ["createdAt", "uid", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchNonExistingTaskItem");

    });

});
