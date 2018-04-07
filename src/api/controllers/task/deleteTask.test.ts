import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../../test/chaiRequest";
import { uids } from "../../../test/fixture";
import { purify } from "../../../test/purify";

describe("DELETE /v1/task", function () {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `task.snap`);

    it("should delete task", async () => {

        const res = await chaiRequest("DELETE", `/v1/tasks/${uids.task1}`, uids.accessToken1);
        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "deleteTask");

    });

    it("should fail deleting non existing task", async () => {

        const path = "/v1/tasks/954f261d-cd52-4070-8e96-b942b4b44a6d";
        const res = await chaiRequest("DELETE", path, uids.accessToken1);

        expect(res.status).to.be.equal(404);
        expect(res.body).to.matchSnapshot(SNAPSHOT_FILE, "deleteNonExistingTask");

    });

});
