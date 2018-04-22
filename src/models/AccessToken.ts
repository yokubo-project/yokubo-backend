import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { User } from "./User";

@Table({
    tableName: "AccessTokens",
    paranoid: false
})
export class AccessToken extends Model<AccessToken> {

    @Column({
        type: DataType.UUID,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    public token: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    public validUntil: string;

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
        allowNull: false,
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

}
