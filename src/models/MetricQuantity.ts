import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

import { TaskItem } from "./TaskItem";
import { IPublicJsonObject as ITaskMetricPublicJsonObject, TaskMetric } from "./TaskMetric";

interface IPublicJsonObject {
    uid: string;
    quantity: number;
    createdAt: Date;
}

export interface IFullPublicJsonObject extends IPublicJsonObject {
    metric: ITaskMetricPublicJsonObject;
}
@Table({
    tableName: "MetricQuantities",
    paranoid: false
})
export class MetricQuantity extends Model<MetricQuantity> {

    @Column({
        type: DataType.UUID,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    public uid: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    public quantity: number;

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

    @ForeignKey(() => TaskItem)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    public TaskItemUid: string;

    @BelongsTo(() => TaskItem)
    public TaskItem: TaskItem;

    @ForeignKey(() => TaskMetric)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    public TaskMetricUid: string;

    @BelongsTo(() => TaskMetric)
    public TaskMetric: TaskMetric;

    /////////////////////////
    // Model class methods //
    /////////////////////////

    ////////////////////////////
    // Model instance methods //
    ////////////////////////////

    public publicJsonObject(): IPublicJsonObject {
        // tslint:disable-next-line:no-this-assignment
        const { uid, quantity, createdAt } = this;

        return {
            uid,
            quantity,
            createdAt
        };
    }

    public async fullPublicJsonObject(): Promise<IFullPublicJsonObject> {
        const publicJsonObject = this.publicJsonObject();
        const metric = (await this.$get("TaskMetric") as TaskMetric).publicJsonObject();

        return {
            ...publicJsonObject,
            metric
        };
    }

}
