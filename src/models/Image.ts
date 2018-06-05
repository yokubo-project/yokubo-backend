import { Column, DataType, Model, Table } from "sequelize-typescript";

import Config from "./../Config";

@Table({
    tableName: "Images",
    paranoid: false
})
export class Image extends Model<Image> {

    @Column({
        type: DataType.UUID,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    public uid: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    public file: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    public createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    public updatedAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null
    })
    public deletedAt: Date;

    /////////////////////////
    // Model class methods //
    /////////////////////////

    ////////////////////////////
    // Model instance methods //
    ////////////////////////////

    public publicJsonObject() {
        // tslint:disable-next-line:no-this-assignment
        const { uid, file } = this;
        const filePath = `${Config.assets.externalUrl}${Config.assets.imageUploadsRelativeUrl}${file}`;

        const thumbnailTemp = file;
        const thumbnailArr = thumbnailTemp.split(".");
        const thumbnailSize = thumbnailArr.length;
        thumbnailArr.splice(thumbnailSize - 1, 0, "thumbnail");
        const thumbnail = thumbnailArr.join(".");

        // Thumbnail has same uid as image but with thumbnail size in its filename
        const thumbnailPath = `${Config.assets.externalUrl}${Config.assets.imageUploadsRelativeUrl}${thumbnail}`;

        return {
            uid,
            file: filePath,
            thumbnail: thumbnailPath
        };

    }

}
