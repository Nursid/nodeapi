const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const AddExpenseModel = sequelize.define('Expense', {
        expHead: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentMethod: {
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
            type: DataTypes.DATE,
            allowNull: false,
        },
        remark: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: true,
        tableName: 'expenses'
    });

    return AddExpenseModel;
};
