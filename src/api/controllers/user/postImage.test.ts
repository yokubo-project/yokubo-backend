import { expect } from "chai";
import * as path from "path";

import chaiRequest from "../../../test/chaiRequest";
import { accessToken1 } from "../../../test/fixture";

describe("POST /v1/images", function () {

    const testimageJpg = path.resolve(path.join(__dirname, "../../../../../assets/testimage.jpg"));
    const testimagePng = path.resolve(path.join(__dirname, "../../../../../assets/testimage.png"));
    const testimageGif = path.resolve(path.join(__dirname, "../../../../../assets/testimage.gif"));

    it("should upload jpg", async () => {

        const uploadRes = await chaiRequest("POST", "/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data")
            .attach("image", testimageJpg, null);

        expect(uploadRes.status).to.be.equal(200);
        expect(uploadRes.body.length).to.be.equal(1);

        const [image1] = uploadRes.body;
        const downloadRes = await fetch(image1.file);
        expect(downloadRes.status).to.equal(200);

    });

    it("should upload png", async () => {

        const uploadRes = await chaiRequest("POST", "/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data")
            .attach("image", testimagePng, null);

        expect(uploadRes.status).to.be.equal(200);
        expect(uploadRes.body.length).to.equal(1);

        const [image1] = uploadRes.body;
        const downloadRes = await fetch(image1.file);
        expect(downloadRes.status).to.equal(200);

    });

    it("should upload multiple images", async () => {

        const uploadRes = await chaiRequest("POST", "/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data")
            .attach("image", testimageJpg, null)
            .attach("image", testimagePng, null);

        expect(uploadRes.status).to.be.equal(200);
        expect(uploadRes.body).to.have.length(2);

        const [image1, image2] = uploadRes.body;

        const downloadRes1 = await fetch(image1.file);
        expect(downloadRes1.status).to.equal(200);

        const downloadRes2 = await fetch(image2.file);
        expect(downloadRes2.status).to.equal(200);

    });

    it("should fail uploading gif", async () => {

        const res = await chaiRequest("POST", "/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data")
            .attach("image", testimageGif, null);

        expect(res.status).to.be.equal(400);

    });

    it("should fail when trying to send multipart without attachments", async () => {

        const res = await chaiRequest("POST", "/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data");

        expect(res.status).to.be.equal(400);

    });

    it("should fail when one of multiple file is not supported", async () => {

        const res = await chaiRequest("POST", "/v1/images", accessToken1.token)
            .set("Content-Type", "multipart/form-data")
            .attach("image", testimageJpg, null)
            .attach("image", testimagePng, null)
            .attach("image", testimageGif, null);

        expect(res.status).to.be.equal(400);

    });

});
