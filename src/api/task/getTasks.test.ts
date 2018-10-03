import { expect } from "chai";
import * as path from "path";

import { Task } from "../../models/Task";
import { accessToken1, task1, task2, task3 } from "../../test/fixture";
import chaiRequest from "../../util/chaiRequest";
import { purify } from "../../util/purify";

describe("GET /api/v1/tasks", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/task.snap");

    it("should get tasks for the requesting user", async () => {

        const res = await chaiRequest("GET", "/api/v1/tasks", accessToken1.token);
        expect(res.status).to.be.equal(200);

        const tasksOwnedByUser = [task1.uid, task2.uid];
        const tasksNowOwnedByUser = [task3.uid];

        // tslint:disable-next-line:chai-vague-errors
        expect(tasksOwnedByUser.every(uid => res.body.some((task: Task) => uid === task.uid))).to.be.equal(true);
        // tslint:disable-next-line:chai-vague-errors
        expect(tasksNowOwnedByUser.every(uid => res.body.every((task: Task) => uid !== task.uid))).to.be.equal(true);

        const preparedSnapshot = purify(res.body, ["createdAt", "period", "date", "daterange"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "getTasks");

    });

});
