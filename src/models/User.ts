import * as bcrypt from "bcrypt";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";

import Config from "../Config";
import { AccessToken } from "./AccessToken";
import { PwdResetToken } from "./PwdResetToken";
import { RefreshToken } from "./RefreshToken";
import { Task } from "./Task";

interface IPublicJsonObject {
    uid: string;
    username: string;
    name: string;
}
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
        type: DataType.BOOLEAN,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        defaultValue: false
    })
    public isAdmin: boolean;

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
    public AccessTokens: AccessToken[];

    @HasMany(() => RefreshToken)
    public RefreshTokens: RefreshToken[];

    @HasMany(() => PwdResetToken)
    public PwdResetTokens: PwdResetToken[];

    @HasMany(() => Task)
    public Tasks: Task[];

    /////////////////////////
    // Model class methods //
    /////////////////////////

    // tslint:disable-next-line:function-name
    public static async hashPassword(password: string): Promise<string> {

        return bcrypt.hash(password, Config.auth.bcryptSaltRounds);

    }

    // tslint:disable-next-line:function-name
    public static async comparePassword(password: string, hash: string): Promise<boolean> {

        return bcrypt.compare(password, hash);

    }

    ////////////////////////////
    // Model instance methods //
    ////////////////////////////

    public publicJsonObject(): IPublicJsonObject {
        // tslint:disable-next-line:no-this-assignment
        const { uid, username, name } = this;

        return {
            uid,
            username,
            name
        };
    }

}
