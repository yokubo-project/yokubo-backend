import { expect } from "chai";
import * as path from "path";

import { accessToken1, image1, task1, taskMetric1 } from "../../test/fixture";
import chaiRequest from "../../util/chaiRequest";
import { purify } from "../../util/purify";

describe("PATCH /api/v1/task", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/task.snap");

    it("should patch task", async () => {

        const payload = {
            name: "Running",
            imageUid: image1.uid
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "date", "daterange"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchTask");

    });

    it("should patch name of task", async () => {

        const payload = {
            name: "Running"
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "date", "daterange"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchTaskName");

    });

    it("should patch image of task", async () => {

        const payload = {
            imageUid: image1.uid
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "date", "daterange"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchTaskImage");

    });

    it("should fail patching non existing task", async () => {

        const payload = {
            name: "Running"
        };

        const apiPath = "/api/v1/tasks/954f261d-cd52-4070-8e96-b942b4b44a6d";
        const res = await chaiRequest("PATCH", apiPath, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(404);
        expect(res.body).to.matchSnapshot(SNAPSHOT_FILE, "patchNonExistingTask");

    });

    it("should add metric to task", async () => {

        const payload = {
            name: "Running",
            metrics: [{
                name: "Temperature",
                unit: "° Celsius",
                action: "create"
            }]
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}`, accessToken1.token)
            .send(payload);
        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "date", "daterange", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "addMetricToTask");

    });

    it("should update metric from task", async () => {

        const payload = {
            name: "Running",
            metrics: [{
                uid: taskMetric1.uid,
                name: "Temperature",
                unit: "° Celsius",
                action: "patch"
            }]
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}`, accessToken1.token)
            .send(payload);
        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "date", "daterange"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchMetricFromTask");

    });

    it("should delete metric from task", async () => {

        const payload = {
            name: "Running",
            metrics: [{
                uid: taskMetric1.uid,
                name: taskMetric1.name,
                unit: taskMetric1.unit,
                action: "delete"
            }]
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "date", "daterange"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "deleteMetricFromTask");

    });

    it("should throw on invalid metric action", async () => {

        const payload = {
            name: "Running",
            metrics: [{
                uid: taskMetric1.uid,
                name: taskMetric1.name,
                unit: taskMetric1.unit,
                action: "invalidAction"
            }]
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}`, accessToken1.token)
            .send(payload);

        expect(res.status).to.be.equal(400);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "date", "daterange"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "invalidActionForTaskMetric");

    });

    it("should succeed with empty metrics array", async () => {

        const payload = {
            name: "Running",
            imageUid: image1.uid,
            metrics: []
        };

        const res = await chaiRequest("PATCH", `/api/v1/tasks/${task1.uid}`, accessToken1.token)
            .send(payload);
        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "date", "daterange"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "patchWithEmptyMetricsArray");

    });

});
