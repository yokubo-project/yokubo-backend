import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../../test/chaiRequest";
import { uids } from "../../../test/fixture";
import { Task } from "../../../shared/models/Task";
import { purify } from "../../../test/purify";

describe("GET /v1/tasks", function () {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `task.snap`);

    it("should get tasks for the requesting user", async () => {

        const res = await chaiRequest("GET", `/v1/tasks`, uids.accessToken1);
        expect(res.status).to.be.equal(200);

        const tasksOwnedByUser = [uids.task1, uids.task2];
        const tasksNowOwnedByUser = [uids.task3];

        expect(tasksOwnedByUser.every(uid => res.body.some((task: Task) => uid === task.uid))).to.be.equal(true);
        expect(tasksNowOwnedByUser.every(uid => res.body.every((task: Task) => uid !== task.uid))).to.be.equal(true);

        const preparedSnapshot = purify(res.body, ["createdAt", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "getTasks");

    });

});
