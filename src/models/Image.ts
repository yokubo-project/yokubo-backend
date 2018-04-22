import { Table, Column, Model, DataType } from "sequelize-typescript";

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
        const { uid, file } = this;
        const filePath = `${Config.assets.externalUrl}${Config.assets.imageUploadsRelativeUrl}${file}`;

        return {
            uid,
            file: filePath
        };

    }

}

