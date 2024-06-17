const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const InventoryModel = sequelize.define('inventories', {
        item: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        qty: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: true,
        tableName: 'inventories', // You can specify the table name here
    });

    return InventoryModel;
};