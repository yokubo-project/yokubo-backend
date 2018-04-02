import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";

import { Task } from "./Task";
import { MetricQuantity } from "./MetricQuantity";

@Table({
    tableName: "TaskItems",
    paranoid: false
})
export class TaskItem extends Model<TaskItem> {

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
        allowNull: true
    })
    public desc: string;

    @Column({
        type: DataType.RANGE(DataType.DATE),
        allowNull: true
    })
    public period: any;

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
        const { uid, name, desc, period, createdAt } = this;
        return {
            uid,
            name,
            desc,
            period,
            createdAt
        };
    }

    public async fullPublicJsonObject() {
        const publicJsonObject = this.publicJsonObject();
        const metricQuantities = await Promise.all((await this.$get("MetricQuantity") as MetricQuantity[]).map(async metricQuantity => metricQuantity.fullPublicJsonObject()));
        return {
            ...publicJsonObject,
            metricQuantities,
        };
    }

}

