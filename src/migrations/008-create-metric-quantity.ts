import { DataType } from "sequelize-typescript";

module.exports = {
    up: async (queryInterface: any): Promise<void> => {
        await queryInterface.createTable("MetricQuantities", {
            uid: {
                type: DataType.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataType.UUIDV4
            },
            quantity: {
                type: DataType.FLOAT,
                allowNull: false
            },
            TaskItemUid: {
                type: DataType.UUID,
                allowNull: false,
                references: {
                    model: "TaskItems",
                    key: "uid"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            TaskMetricUid: {
                type: DataType.UUID,
                allowNull: false,
                references: {
                    model: "TaskMetrics",
                    key: "uid"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            createdAt: {
                type: DataType.DATE,
                allowNull: false,
                defaultValue: DataType.NOW
            },
            updatedAt: {
                type: DataType.DATE,
                allowNull: false,
                defaultValue: DataType.NOW
            },
            deletedAt: {
                type: DataType.DATE,
                allowNull: true,
                defaultValue: null
            }
        });
    },

    down: async (queryInterface: any): Promise<void> => {
        await queryInterface.dropTable("MetricQuantities");
    }
};
