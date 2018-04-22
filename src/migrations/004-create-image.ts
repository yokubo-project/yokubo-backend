import { DataType } from "sequelize-typescript";

module.exports = {
    up: async (queryInterface: any): Promise<void> => {
        await queryInterface.createTable("Images", {
            uid: {
                type: DataType.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataType.UUIDV4
            },
            file: {
                type: DataType.STRING(2048),
                allowNull: false
            },
            UserUid: {
                type: DataType.UUID,
                allowNull: true, // images may not be associated with a user
                references: {
                    model: "Users",
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
        await queryInterface.dropTable("Images");
    }
};
