const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const AddCollectionModel = sequelize.define('Collection', {
        serviceProvider: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        serviceName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expenseType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        personName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timeIn: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timeOut: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        remark: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: true,
        tableName: 'collections'
    });

    return AddCollectionModel;
};
