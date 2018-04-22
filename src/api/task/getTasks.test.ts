import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../test/chaiRequest";
import { accessToken1, task1, task2, task3 } from "../../test/fixture";
import { Task } from "../../shared/models/Task";
import { purify } from "../../test/purify";

describe("GET /api/v1/tasks", function () {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `task.snap`);

    it("should get tasks for the requesting user", async () => {

        const res = await chaiRequest("GET", `/api/v1/tasks`, accessToken1.token);
        expect(res.status).to.be.equal(200);

        const tasksOwnedByUser = [task1.uid, task2.uid];
        const tasksNowOwnedByUser = [task3.uid];

        expect(tasksOwnedByUser.every(uid => res.body.some((task: Task) => uid === task.uid))).to.be.equal(true);
        expect(tasksNowOwnedByUser.every(uid => res.body.every((task: Task) => uid !== task.uid))).to.be.equal(true);

        const preparedSnapshot = purify(res.body, ["createdAt", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "getTasks");

    });

});
