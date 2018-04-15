import { DataType } from "sequelize-typescript";

module.exports = {
    up: async (queryInterface: any): Promise<void> => {
        await queryInterface.createTable("Users", {
            uid: {
                type: DataType.UUID,
                allowNull: false,
                defaultValue: DataType.UUIDV4,
                primaryKey: true
            },
            username: {
                type: DataType.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true
                }
            },
            name: {
                type: DataType.STRING,
                allowNull: false,
                unique: false,
                validate: {
                    notEmpty: true
                }
            },
            password: {
                type: DataType.STRING(2048),
                allowNull: false,
                unique: false,
                validate: {
                    notEmpty: true
                }
            },
            isAdmin: {
                type: DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false
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
        await queryInterface.dropTable("Users");
    }
};
