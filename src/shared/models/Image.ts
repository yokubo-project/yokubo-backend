import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";

import Config from "./../../shared/Config";
import { User } from "./User";

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

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    public UserUid: string;

    @BelongsTo(() => User)
    User: User;

    /////////////////////////
    // Model class methods //
    /////////////////////////

    ////////////////////////////
    // Model instance methods //
    ////////////////////////////

    public async publicJsonObject() {
        const { uid, file } = this;
        const filePath = `${Config.assets.externalUrl}${Config.assets.imageUploadsRelativeUrl}${file}`;

        return {
            uid,
            file: filePath
        };

    }

}

