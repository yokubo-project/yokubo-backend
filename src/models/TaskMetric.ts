import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";

import { MetricQuantity } from "./MetricQuantity";
import { Task } from "./Task";

export interface IPublicJsonObject {
    uid: string;
    name: string;
    unit: string;
    createdAt: Date;
}
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
        allowNull: true
    })
    public TaskUid: string;

    @BelongsTo(() => Task)
    public Task: Task;

    @HasMany(() => MetricQuantity)
    public MetricQuantities: MetricQuantity[];

    /////////////////////////
    // Model class methods //
    /////////////////////////

    ////////////////////////////
    // Model instance methods //
    ////////////////////////////

    public publicJsonObject(): IPublicJsonObject {
        // tslint:disable-next-line:no-this-assignment
        const { uid, name, unit, createdAt } = this;

        return {
            uid,
            name,
            unit,
            createdAt
        };
    }

}
