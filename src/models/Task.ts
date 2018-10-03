import * as _ from "lodash";
import * as Moment from "moment";
import { DateRange, extendMoment } from "moment-range";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";

const moment = extendMoment(Moment);

import { Image, IPublicJsonObject as IImagePublicJsonObject } from "./Image";
import { IFullPublicJsonObject as ITaskItemFullPublicJsonObject, TaskItem } from "./TaskItem";
import { IPublicJsonObject as ITaskMetricFullPublicJsonObject, TaskMetric } from "./TaskMetric";
import { User } from "./User";

interface IPublicJsonObject {
    uid: string;
    name: string;
    createdAt: Date;
}

interface ITaskItemStats {
    metricKey: string;
    metricName: string;
    metricUnit: string;
    totalItems: number;
    totalValue: number;
    averageValue: number;
    minValue: number;
    maxValue: number;
}

interface IChartData {
    days: {
        date: Moment.Moment;
        totalValue: number;
        metricKey: string;
        metricName: string;
        metricUnit: string;
    }[];
    weeks: {
        daterange: DateRange;
        totalValue: number;
        metricKey: string;
        metricName: string;
        metricUnit: string;
    }[];
    months: {
        daterange: DateRange;
        totalValue: number;
        metricKey: string;
        metricName: string;
        metricUnit: string;
    }[];
}
interface IFullPublicJsonObject extends IPublicJsonObject {
    image: IImagePublicJsonObject;
    metrics: ITaskMetricFullPublicJsonObject[];
    items: ITaskItemFullPublicJsonObject[];
    stats: ITaskItemStats[];
    chartData: IChartData;
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
        const stats = getTaskItemStats(items);
        const chartData = getChartData(items);

        return {
            ...publicJsonObject,
            image,
            metrics,
            items,
            stats,
            chartData
        };
    }

}

function getTaskItemStats(items: ITaskItemFullPublicJsonObject[]): ITaskItemStats[] {

    const stats: ITaskItemStats[] = [];

    // calculate time stats
    stats.push(
        items.reduce(
            (initialValue, item) => {
                const ms = item.duration ? item.duration * 1000 : null;
                if (ms) {
                    initialValue.totalItems += 1;
                    initialValue.totalValue += ms;
                    initialValue.averageValue = initialValue.totalValue / items.length;
                    initialValue.minValue = initialValue.minValue === 0 || ms < initialValue.minValue ? ms : initialValue.minValue;
                    initialValue.maxValue = ms > initialValue.maxValue ? ms : initialValue.maxValue;
                }

                return initialValue;
            },
            {
                metricKey: "duration",
                metricName: "Duration",
                metricUnit: "ms",
                totalItems: 0,
                totalValue: 0,
                averageValue: 0,
                minValue: 0,
                maxValue: 0
            }
        )
    );

    // calculate metric stats
    items.forEach(item => {
        if (item.metricQuantities.length > 0) {
            item.metricQuantities.forEach(metric => {
                const metricObject = stats.filter(metricOb => metricOb.metricName === metric.metric.name)[0];
                if (metricObject) {
                    metricObject.totalItems += 1;
                    metricObject.totalValue += metric.quantity;
                    metricObject.averageValue = parseFloat((metricObject.totalValue / items.length).toFixed(2));
                    metricObject.minValue =
                        metric.quantity < metricObject.minValue ? metric.quantity : metricObject.minValue;
                    metricObject.maxValue =
                        metric.quantity > metricObject.maxValue ? metric.quantity : metricObject.maxValue;
                } else {
                    stats.push({
                        metricKey: metric.uid,
                        metricName: metric.metric.name,
                        metricUnit: metric.metric.unit,
                        totalItems: 1,
                        totalValue: metric.quantity,
                        averageValue: metric.quantity,
                        minValue: metric.quantity,
                        maxValue: metric.quantity
                    });
                }
            });
        }
    });

    return stats;
}

function getChartData(items: ITaskItemFullPublicJsonObject[]): IChartData {

    const momentDays = _.times(14).map(x => moment().utc().startOf("day").subtract(x, "days"));
    const momentWeeks = _.times(12).map(x => moment.range(
        moment().utc().startOf("isoweek" as Moment.unitOfTime.StartOf).subtract(x, "weeks"),
        moment().utc().endOf("isoweek" as Moment.unitOfTime.StartOf).subtract(x, "weeks")
    ));
    const momentMonths = _.times(12).map(x => moment.range(
        moment().utc().subtract(x, "month").startOf("month"),
        moment().utc().subtract(x, "month").endOf("month")
    ));

    const chartData: IChartData = {
        days: momentDays.map(((e, index, arr) => {
            return {
                date: arr[index],
                totalValue: 0,
                metricKey: "duration",
                metricName: "Duration",
                metricUnit: "ms"
            };
        })),
        weeks: momentWeeks.map((e, index, arr) => {
            return {
                daterange: arr[index],
                totalValue: 0,
                metricKey: "duration",
                metricName: "Duration",
                metricUnit: "ms"
            };
        }),
        months: momentMonths.map((e, index, arr) => {
            return {
                daterange: arr[index],
                totalValue: 0,
                metricKey: "duration",
                metricName: "Duration",
                metricUnit: "ms"
            };
        })
    };

    items.forEach(item => {
        if (item.period && item.period[0]) {
            const chartday = chartData.days.filter(day => day.date.isSame(moment(item.period[0]).utc().startOf("day")))[0];
            if (chartday) {
                chartday.totalValue += item.duration ? item.duration * 1000 : 0;
            }
            const chartweek = chartData.weeks.filter(week => week.daterange.contains(moment(item.period[0])))[0];
            if (chartweek) {
                chartweek.totalValue += item.duration ? item.duration * 1000 : 0;
            }
            const chartmonth = chartData.months.filter(month => month.daterange.contains(moment(item.period[0])))[0];
            if (chartmonth) {
                chartmonth.totalValue += item.duration ? item.duration * 1000 : 0;
            }
        }
    });

    return chartData;
}
