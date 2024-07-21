const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const EnquiryModel = sequelize.define('enquiry', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refName: {
            type: DataTypes.STRING,
        },
        mobileNo: {
            type: DataTypes.STRING,
        },
        message: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        service: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: true,
        tableName: 'enquiries', // You can specify the table name here
    });

    return EnquiryModel;
};
