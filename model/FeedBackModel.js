const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const FeedbackModel = sequelize.define('feedback', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
        },
        serviceDetails: {
            type: DataTypes.STRING,
        },
        willCallBack: {
            type: DataTypes.BOOLEAN,
        },
        serviceRating: {
            type: DataTypes.INTEGER,
        },
        recommendation: {
            type: DataTypes.STRING,
        },
        helperRating: {
            type: DataTypes.INTEGER,
        }
    }, {
        timestamps: true,
        tableName: 'feedbacks', // You can specify the table name here
    });

    return FeedbackModel;
};
