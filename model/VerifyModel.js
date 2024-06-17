const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const VerifyModel = sequelize.define('otp', {
        otp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otpid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otpExpireTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        timestamps: true,
        tableName: 'otps', // You can specify the table name here
    });

    return VerifyModel;
};
