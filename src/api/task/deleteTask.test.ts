import { expect } from "chai";
import * as path from "path";

import { accessToken1, task1 } from "../../test/fixture";
import chaiRequest from "../../util/chaiRequest";
import { purify } from "../../util/purify";

describe("DELETE /api/v1/task", () => {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/task.snap");

    it("should delete task", async () => {

        const res = await chaiRequest("DELETE", `/api/v1/tasks/${task1.uid}`, accessToken1.token);
        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "deleteTask");

    });

    it("should fail deleting non existing task", async () => {

        const apiPath = "/api/v1/tasks/954f261d-cd52-4070-8e96-b942b4b44a6d";
        const res = await chaiRequest("DELETE", apiPath, accessToken1.token);

        expect(res.status).to.be.equal(404);
        expect(res.body).to.matchSnapshot(SNAPSHOT_FILE, "deleteNonExistingTask");

    });

});
