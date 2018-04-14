import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import * as bcrypt from "bcrypt";
import Config from "../Config";
import { AccessToken } from "./AccessToken";
import { RefreshToken } from "./RefreshToken";
import { Task } from "./Task";
import { PwdResetToken } from "./PwdResetToken";

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
        allowNull: false
    })
    public name: string;

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

    @HasMany(() => AccessToken)
    AccessTokens: AccessToken[];

    @HasMany(() => RefreshToken)
    RefreshTokens: RefreshToken[];

    @HasMany(() => PwdResetToken)
    PwdResetTokens: PwdResetToken[];

    @HasMany(() => Task)
    Tasks: Task[];

    /////////////////////////
    // Model class methods //
    /////////////////////////

    public static async hashPassword(password: string): Promise<string> {

        return bcrypt.hash(password, Config.auth.bcryptSaltRounds);

    }

    public static async comparePassword(password: string, hash: string): Promise<boolean> {

        return bcrypt.compare(password, hash);

    }

    ////////////////////////////
    // Model instance methods //
    ////////////////////////////

    public publicJsonObject() {
        const { uid, username, name } = this;
        return {
            uid,
            username,
            name
        };
    }

}
