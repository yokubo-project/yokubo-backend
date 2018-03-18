import { Table, Column, Model, DataType, HasOne, HasMany } from "sequelize-typescript";
import * as bcrypt from "bcrypt";
import Config from "../Config";
import { AppUserProfile } from "./AppUserProfile";
import { AccessToken } from "./AccessToken";
import { RefreshToken } from "./RefreshToken";

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

    @HasOne(() => AppUserProfile)
    AppUserProfile: AppUserProfile;

    @HasMany(() => AccessToken)
    AccessTokens: AccessToken[];

    @HasMany(() => RefreshToken)
    RefreshTokens: RefreshToken[];

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

}
