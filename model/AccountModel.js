const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Account = sequelize.define('accounts', {
        payment_mode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        transection_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        upi: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cash: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'accounts',
    });
    return Account;
};