import * as Boom from "boom";
import * as fileType from "file-type";
import * as fs from "fs-extra";
import * as Hapi from "hapi";
import * as im from "imagemagick";
import * as Joi from "joi";
import * as _ from "lodash";
import * as multiparty from "multiparty";
import * as path from "path";
import * as readChunk from "read-chunk";
import * as uuid from "uuid";

import Config from "../../Config";
import { Image } from "../../models/Image";
import log from "../../util/log";
import sequelize, { Transaction } from "../../util/sequelize";
import { errorCodes } from "./_errorCodes";
import * as _schema from "./_schema";

// ensure user upload dir exists
fs.ensureDirSync(Config.assets.imageUploadsPath);

// promisify
const convert: (args: any) => Promise<im.Features> = Promise.promisify(im.convert, { context: im }) as any;

export const postImage = [{
    method: "POST",
    path: "/api/v1/images",
    handler: postImageHandler,
    config: {
        auth: {
            scope: ["default_user"]
        },
        description: "Registers a user",
        tags: ["api", "post", "v1", "auth", "image"],
        payload: {
            maxBytes: Config.imageUpload.maxUpload,
            output: "stream",
            parse: false,
            allow: "multipart/form-data"
        },
        response: {
            schema: Joi.array().items(_schema.ImageSchema.required()).required()
        }
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
        throw Boom.badRequest(errorCodes.NO_FILES_ATTACHED);
    }

    // Check mime type of each file
    const validFilesProperties = await Promise.map(files, async file => {

        // Check extension of file name is suppported
        const fileExtension = file.split(".")[file.split(".").length - 1];
        if (!_.includes(Config.imageUpload.supportedExtensions, fileExtension)) {
            fs.unlink(file);
            throw Boom.badRequest(errorCodes.UNSUPPORTED_FILE_EXT);
        }

        // Read in the first 4100 bytes of the file which usually contains mime-type information
        const buffer = await readChunk(file, 0, 4100);
        const filetype = fileType(buffer);

        if (!filetype) {
            fs.unlink(file);
            throw Boom.badRequest(errorCodes.MIME_TYPE_MISSING);
        }

        if (!_.includes(Config.imageUpload.supportedMimeTypes, filetype.mime)) {
            fs.unlink(file);
            throw Boom.badRequest(errorCodes.UNSUPPORTED_MIME_TYPE);
        }

        // File is ok
        return {
            file,
            fileExtension,
            filetype
        };
    });

    return sequelize.transaction(async (transaction: Transaction) => {

        try {

            return await Promise.map(validFilesProperties, async (validFileProperties) => {

                // Move file on disk
                const uuidv4 = uuid.v4();
                const file = `${uuidv4}.${validFileProperties.filetype.ext}`;
                const filepath = path.join(Config.assets.imageUploadsPath, file);
                await fs.move(validFileProperties.file, filepath);

                // Create thumbnail image
                const thumbnail = `${uuidv4}.thumbnail.${validFileProperties.filetype.ext}`;
                const thumbnailPath = path.join(Config.assets.imageUploadsPath, thumbnail);
                await convert([filepath, "-resize", Config.assets.thumbSize, thumbnailPath]);

                // Save to db
                const image = await Image.create({
                    file
                });

                return image.publicJsonObject();

            });

        } catch (err) {

            log.fatal({
                err,
                validFilesProperties
            },        "Unable to process image upload");

            // Delete all files in case of error, no need to wait for the result
            await Promise.each(validFilesProperties, async (validFileProperties) => {

                const file = `${uuid.v4()}.${validFileProperties.filetype.ext}`;
                const filepath = path.join(Config.assets.imageUploadsPath, file);
                await fs.unlink(filepath);

            });

            throw Boom.badGateway(errorCodes.UNABLE_TO_PROCESS_REQUEST);

        }

    });

}

function extractMultipartPayload(payload: any): Promise<{
    files: any;
    fields: any;
}> {
    return new Promise((resolve, reject) => {
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
    const files = [];
    // tslint:disable-next-line:no-for-in
    for (const fileKey in multipartContents.files) {
        if (multipartContents.files.hasOwnProperty(fileKey)) {
            for (const fileContents of multipartContents.files[fileKey]) {
                files.push(fileContents.path);
            }
        }
    }

    return files;
}
