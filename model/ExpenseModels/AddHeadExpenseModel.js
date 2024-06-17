const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const HeadExpModel = sequelize.define('expense_head', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status:{
            type: DataTypes.BOOLEAN,
            default: false,
        }
    }, {
        timestamps: true,
        tableName: 'expense_heads'
    });

    return HeadExpModel;
};
