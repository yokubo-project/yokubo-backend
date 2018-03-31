import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as fs from "fs-extra";
import * as path from "path";
import * as readChunk from "read-chunk";
import * as fileType from "file-type";
import * as uuid from "uuid";
import * as multiparty from "multiparty";
import * as _ from "lodash";

import Config from "../../../shared/Config";
import sequelize, { Transaction } from "../../../shared/util/sequelize";
import log from "../../../shared/util/log";
import * as _schema from "./_schema";
import { Image } from "../../../shared/models/Image";

// ensure user upload dir exists
fs.ensureDirSync(Config.assets.imageUploadsPath);

export const postImage = [{
    method: "POST",
    path: "/v1/images",
    handler: postImageHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Registers a user",
        tags: ["api", "get", "v1", "auth", "register"],
        payload: {
            maxBytes: Config.imageUpload.maxUpload,
            output: "stream",
            parse: false,
            allow: "multipart/form-data"
        },
        response: {
            schema: Joi.array().items(_schema.ImageSchema.required()).required()
        },
    }
}];

async function postImageHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    // Extract multipart data from payload
    const multipartPyload = await extractMultipartPayload(request.payload);
    log.debug({ multipartPyload }, "Extracted multipart payload");

    // Extract files from multipart payload
    const files = await extractFilesFromMultipartUpload(multipartPyload);
    log.debug({ files }, "Extracted files");

    if (files.length === 0) {
        throw Boom.badRequest(`Error: No files have been attached.`);
    }

    // Check mime type of each file
    const validFilesProperties = await Promise.map(files, async file => {

        // Check extension of file name is suppported
        const fileExtension = file.split(".")[file.split(".").length - 1];
        if (!_.includes(Config.imageUpload.supportedExtensions, fileExtension)) {
            fs.unlink(file);
            throw Boom.badRequest("Error: Unsupported file extension found.");
        }

        // Read in the first 4100 bytes of the file which usually contains mime-type information
        const buffer = await readChunk(file, 0, 4100);
        const filetype = fileType(buffer);

        if (!filetype) {
            fs.unlink(file);
            throw Boom.badRequest("Error: No mime-type found.");
        }

        if (!_.includes(Config.imageUpload.supportedMimeTypes, filetype.mime)) {
            fs.unlink(file);
            throw Boom.badRequest("Error: Got unsupported mime-type.");
        }

        // File is ok
        return {
            file,
            fileExtension,
            filetype
        };
    });

    return await sequelize.transaction(async (transaction: Transaction) => {

        try {

            return await Promise.map(validFilesProperties, async (validFileProperties) => {

                // Move file on disk
                const file = `${uuid.v4()}.${validFileProperties.filetype.ext}`;
                const filepath = path.join(Config.assets.imageUploadsPath, file);
                await fs.move(validFileProperties.file, filepath);

                // Save to db
                const image = await Image.create({
                    file,
                });

                return image.publicJsonObject();

            });

        } catch (err) {

            log.fatal({
                err,
                validFilesProperties
            }, "Unable to process image upload");

            // Delete all files in case of error, no need to wait for the result
            await Promise.each(validFilesProperties, async (validFileProperties) => {

                const file = `${uuid.v4()}.${validFileProperties.filetype.ext}`;
                const filepath = path.join(Config.assets.imageUploadsPath, file);
                await fs.unlink(filepath);

            });

            throw Boom.badGateway("Error: Unable to process image upload");

        }

    });

}

function extractMultipartPayload(payload: any): Promise<{
    files: any;
    fields: any;
}> {
    return new Promise(function (resolve, reject) {
        const form = new multiparty.Form({});

        form.parse(payload, (err: any, fields: any, files: any) => {
            // On Error
            if (err) {
                return reject(err);
            }
            // On Success
            return resolve({
                files: files,
                fields: fields
            });
        });
    });
}

function extractFilesFromMultipartUpload(multipartContents: any): string[] {
    let files = [];
    for (let fileKey in multipartContents.files) {
        if (multipartContents.files.hasOwnProperty(fileKey)) {
            for (let fileContents of multipartContents.files[fileKey]) {
                files.push(fileContents.path);
            }
        }
    }
    return files;
}
