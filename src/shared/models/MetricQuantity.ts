import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";

import { TaskItem } from "./TaskItem";
import { TaskMetric } from "./TaskMetric";

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
        allowNull: false,
    })
    public TaskItemUid: string;

    @BelongsTo(() => TaskItem)
    TaskItem: TaskItem;

    @ForeignKey(() => TaskMetric)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    public TaskMetricUid: string;

    @BelongsTo(() => TaskMetric)
    TaskMetric: TaskMetric;

    /////////////////////////
    // Model class methods //
    /////////////////////////

    ////////////////////////////
    // Model instance methods //
    ////////////////////////////

    public publicJsonObject() {
        const { uid, quantity, createdAt } = this;
        return {
            uid,
            quantity,
            createdAt,
        };
    }

    public async fullPublicJsonObject() {
        const publicJsonObject = this.publicJsonObject();
        const metric = (await this.$get("TaskMetric") as TaskMetric).publicJsonObject();
        return {
            ...publicJsonObject,
            metric,
        };
    }

}
