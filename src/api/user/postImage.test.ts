import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../util/chaiRequest";
import { accessToken1 } from "../../test/fixture";
import { purify } from "../../util/purify";

describe("POST /api/v1/images", function () {

    const SNAPSHOT_FILE = path.join(__dirname, "../../../../snapshots/", `image.snap`);

    const testimageJpg = path.resolve(path.join(__dirname, "../../../../assets/testimage.jpg"));
    const testimagePng = path.resolve(path.join(__dirname, "../../../../assets/testimage.png"));
    const testimageGif = path.resolve(path.join(__dirname, "../../../../assets/testimage.gif"));

    it("should upload jpg", async () => {

        const uploadRes = await chaiRequest("POST", "/api/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data")
            .attach("image", testimageJpg, null);

        expect(uploadRes.status).to.be.equal(200);
        expect(uploadRes.body.length).to.be.equal(1);

        const preparedSnapshot = purify(uploadRes.body, ["file", "thumbnail", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "uploadJpgImage");

        const [image1] = uploadRes.body;
        const downloadRes = await fetch(image1.file);
        expect(downloadRes.status).to.equal(200);

    });

    it("should upload png", async () => {

        const uploadRes = await chaiRequest("POST", "/api/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data")
            .attach("image", testimagePng, null);

        expect(uploadRes.status).to.be.equal(200);
        expect(uploadRes.body.length).to.equal(1);

        const preparedSnapshot = purify(uploadRes.body, ["file", "thumbnail", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "uploadPngImage");

        const [image1] = uploadRes.body;
        const downloadRes = await fetch(image1.file);
        expect(downloadRes.status).to.equal(200);

    });

    it("should upload multiple images", async () => {

        const uploadRes = await chaiRequest("POST", "/api/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data")
            .attach("image", testimageJpg, null)
            .attach("image", testimagePng, null);

        expect(uploadRes.status).to.be.equal(200);
        expect(uploadRes.body).to.have.length(2);

        const preparedSnapshot = purify(uploadRes.body, ["file", "thumbnail", "uid"]);
        expect(preparedSnapshot).to.matchSnapshot(SNAPSHOT_FILE, "uploadMultipleImages");

        const [image1, image2] = uploadRes.body;

        const downloadRes1 = await fetch(image1.file);
        expect(downloadRes1.status).to.equal(200);

        const downloadRes2 = await fetch(image2.file);
        expect(downloadRes2.status).to.equal(200);

    });

    it("should fail uploading gif", async () => {

        const res = await chaiRequest("POST", "/api/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data")
            .attach("image", testimageGif, null);

        expect(res.status).to.be.equal(400);
        expect(res.body).to.matchSnapshot(SNAPSHOT_FILE, "failUploadingGifImage");

    });

    it("should fail when trying to send multipart without attachments", async () => {

        const res = await chaiRequest("POST", "/api/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data");

        expect(res.status).to.be.equal(400);
        expect(res.body).to.matchSnapshot(SNAPSHOT_FILE, "failUploadingWithoutAttachments");

    });

    it("should fail when one of multiple file is not supported", async () => {

        const res = await chaiRequest("POST", "/api/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data")
            .attach("image", testimageJpg, null)
            .attach("image", testimagePng, null)
            .attach("image", testimageGif, null);

        expect(res.status).to.be.equal(400);
        expect(res.body).to.matchSnapshot(SNAPSHOT_FILE, "failUploadingWithUnsupportedImage");

    });

});
