import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
    tableName: "Users",
    paranoid: false
})
export class User extends Model<User> {

    @Column({
        type: DataType.UUID,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    public uid: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    })
    public username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    })
    public password: string;

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

}
