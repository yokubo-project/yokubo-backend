import { DataType } from "sequelize-typescript";

module.exports = {
    up: async (queryInterface: any): Promise<void> => {
        await queryInterface.createTable("TaskItems", {
            uid: {
                type: DataType.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataType.UUIDV4
            },
            name: {
                type: DataType.STRING(2048),
                allowNull: false
            },
            desc: {
                type: DataType.STRING(4096),
                allowNull: true, // null indicates no description
            },
            period: {
                type: DataType.RANGE(DataType.DATE),
                allowNull: true, // null inidicates no period.
            },
            TaskUid: {
                type: DataType.UUID,
                allowNull: false,
                references: {
                    model: "Tasks",
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
        await queryInterface.dropTable("TaskItems");
    }
};
