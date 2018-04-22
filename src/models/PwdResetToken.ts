import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { User } from "./User";

@Table({
    tableName: "PwdResetTokens",
    paranoid: false
})
export class PwdResetToken extends Model<PwdResetToken> {

    length(arg0: any): any {
        throw new Error("Method not implemented.");
    }
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

    public publicJsonObject() {
        const { validUntil } = this;
        return {
            validUntil,
        };
    }

}
