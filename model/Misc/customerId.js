const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const CustomerID = sequelize.define('customerId', {
        seq: {
            type: DataTypes.INTEGER,
        },
    }, {
        timestamps: true,
        tableName: 'customerIds', // You can specify the table name here
    });

    return CustomerID;
};
