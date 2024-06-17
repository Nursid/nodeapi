const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
const MonthlyServiceModel = sequelize.define('monthlyservices', {
    cust_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    monthlyServices: {
      type: DataTypes.STRING
    },
    serviceType: {
      type: DataTypes.STRING
    },
    serviceServeType: {
      type: DataTypes.STRING
    },
    selectedTimeSlot: {
      type: DataTypes.STRING
    },
    serviceFees: {
      type: DataTypes.DECIMAL(10, 2)
    },
    feesPaidDateTime: {
      type: DataTypes.DATE
    },
    user_id: {
        type: DataTypes.STRING
    },
    specialInterest: {
      type: DataTypes.STRING
    }}, {
        timestamps: true, 
        tableName: 'monthlyservices'
    });

    return MonthlyServiceModel
};
