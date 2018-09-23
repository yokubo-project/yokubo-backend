import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";

import { Image, IPublicJsonObject as IImagePublicJsonObject } from "./Image";
import { IFullPublicJsonObject as ITaskItemFullPublicJsonObject, TaskItem } from "./TaskItem";
import { IPublicJsonObject as ITaskMetricFullPublicJsonObject, TaskMetric } from "./TaskMetric";
import { User } from "./User";

interface IPublicJsonObject {
    uid: string;
    name: string;
    createdAt: Date;
}
interface IFullPublicJsonObject extends IPublicJsonObject {
    image: IImagePublicJsonObject;
    metrics: ITaskMetricFullPublicJsonObject[];
    items: ITaskItemFullPublicJsonObject[];
}
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
        allowNull: false
    })
    public UserUid: string;

    @BelongsTo(() => User)
    public User: User;

    @ForeignKey(() => Image)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    public ImageUid: string;

    @BelongsTo(() => Image)
    public Image: Image;

    @HasMany(() => TaskMetric)
    public TaskMetrics: TaskMetric[];

    @HasMany(() => TaskItem)
    public TaskItems: TaskItem[];

    /////////////////////////
    // Model class methods //
    /////////////////////////

    ////////////////////////////
    // Model instance methods //
    ////////////////////////////

    public publicJsonObject(): IPublicJsonObject {
        // tslint:disable-next-line:no-this-assignment
        const { uid, name, createdAt } = this;

        return {
            uid,
            name,
            createdAt
        };
    }

    public async fullPublicJsonObject(): Promise<IFullPublicJsonObject> {
        const publicJsonObject = this.publicJsonObject();
        const image = await (await this.$get("Image") as Image).publicJsonObject();
        const metrics = (await this.$get("TaskMetrics") as TaskMetric[]).map(taskMetric => taskMetric.publicJsonObject());
        const items = await Promise.all(
            (await this.$get("TaskItems") as TaskItem[]).map(async taskItem => taskItem.fullPublicJsonObject())
        );

        return {
            ...publicJsonObject,
            image,
            metrics,
            items
        };
    }

}
