import { DataType } from "sequelize-typescript";

module.exports = {
    up: async (queryInterface: any): Promise<void> => {
        await queryInterface.createTable("PwdResetTokens", {
            token: {
                type: DataType.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataType.UUIDV4
            },
            validUntil: {
                type: DataType.DATE,
                allowNull: false
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
            },
            UserUid: {
                type: DataType.UUID,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "uid"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            }
        });
    },

    down: async (queryInterface: any): Promise<void> => {
        await queryInterface.dropTable("PwdResetTokens");
    }
};
