import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../util/chaiRequest";
import { accessToken1, task1, taskItem1 } from "../../test/fixture";
import { purify } from "../../util/purify";

describe("DELETE /api/v1/tasks/{taskUid}/items/{itemUid}", function () {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../../snapshots/", `task.snap`);

    it("should delete task item", async () => {

        const res = await chaiRequest("DELETE", `/api/v1/tasks/${task1.uid}/items/${taskItem1.uid}`, accessToken1.token);
        expect(res.status).to.be.equal(200);

        const preparedSnapshot = purify(res.body, ["createdAt", "period"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "deleteTaskItem");

    });

    it("should fail deleting non existing task", async () => {

        const path = `/api/v1/tasks/${task1.uid}/items/954f261d-cd52-4070-8e96-b942b4b44a6d`;
        const res = await chaiRequest("DELETE", path, accessToken1.token);

        expect(res.status).to.be.equal(404);
        expect(res.body).to.matchSnapshot(SNAPSHOT_FILE, "deleteNonExistingTaskItem");

    });

});
