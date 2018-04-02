import { Table, Column, Model, DataType, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript";

import { User } from "./User";
import { Image } from "./Image";
import { TaskMetric } from "./TaskMetric";
import { TaskItem } from "./TaskItem";

@Table({
    tableName: "Tasks",
    paranoid: false
})
export class Task extends Model<Task> {

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
    public name: string;

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

    @ForeignKey(() => Image)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    public ImageUid: string;

    @BelongsTo(() => Image)
    Image: Image;

    @HasMany(() => TaskMetric)
    TaskMetrics: TaskMetric[];

    @HasMany(() => TaskItem)
    TaskItems: TaskItem[];

    /////////////////////////
    // Model class methods //
    /////////////////////////

    ////////////////////////////
    // Model instance methods //
    ////////////////////////////

    public async publicJsonObject() {
        const { uid, name, createdAt } = this;
        return {
            uid,
            name,
            createdAt
        };
    }

    public async fullpublicJsonObject() {
        const publicJsonObject = this.publicJsonObject();
        const image = await (await this.$get("Image") as Image).publicJsonObject();
        const metrics = (await this.$get("TaskMetric") as TaskMetric[]).map(taskMetric => taskMetric.publicJsonObject());
        const items = await Promise.all((await this.$get("TaskItem") as TaskItem[]).map(async taskItem => taskItem.fullPublicJsonObject()));
        return {
            ...publicJsonObject,
            image,
            metrics,
            items
        };
    }

}

