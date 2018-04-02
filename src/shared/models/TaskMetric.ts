import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";

import { Task } from "./Task";
import { MetricQuantity } from "./MetricQuantity";

@Table({
    tableName: "TaskMetrics",
    paranoid: false
})
export class TaskMetric extends Model<TaskMetric> {

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
        type: DataType.STRING,
        allowNull: false
    })
    public unit: string;

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

    @ForeignKey(() => Task)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    public TaskUid: string;

    @BelongsTo(() => Task)
    Task: Task;

    @HasMany(() => MetricQuantity)
    MetricQuantities: MetricQuantity[];

    /////////////////////////
    // Model class methods //
    /////////////////////////

    ////////////////////////////
    // Model instance methods //
    ////////////////////////////

    public async publicJsonObject() {
        const { uid, name, unit, createdAt } = this;
        return {
            uid,
            name,
            unit,
            createdAt
        };
    }

}
