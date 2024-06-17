const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const OrderNo = sequelize.define('orderNo', {
        seq: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: true,
        tableName: 'orderNos', // You can specify the table name here
    });

    return OrderNo;
};
