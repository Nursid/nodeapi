const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const MonthlyServiceModel = sequelize.define('monthlyservices', {
        cust_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        monthlyServices: {
            type: DataTypes.STRING,
            allowNull: true
        },
        serviceType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        serviceServeType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        service_provider: {
            type: DataTypes.STRING,
            allowNull: true
        },
        supervisor: {
            type: DataTypes.STRING,
            allowNull: true
        },
        selectedTimeSlot: {
            type: DataTypes.STRING,
            allowNull: true
        },
        serviceFees: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        feesPaidDateTime: {
            type: DataTypes.STRING,
            allowNull: true
        },
        specialInterest: {
            type: DataTypes.STRING,
            allowNull: true
        },
        kit_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bike_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paymethod: {
            type: DataTypes.STRING,
            allowNull: true
        },
        netpayamt: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        piadamt: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        totalamt: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        near_by: {
            type: DataTypes.STRING,
            allowNull: true
        },
        land_mark: {
            type: DataTypes.STRING,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },

        before_cleaning: {
            type: DataTypes.STRING,
            allowNull: true
        },
        after_cleaning: {
            type: DataTypes.STRING,
            allowNull: true
        },
        shift: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reference2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mohalla: {
            type: DataTypes.STRING,
            allowNull: true
        },
        area: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false
        },
         checkintime: {
          type: DataTypes.STRING,
          allowNull: true
        },
         checkouttime: {
          type: DataTypes.STRING,
          allowNull: true
        },
         pending: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        orderNo: {
          type: DataTypes.STRING,
          allowNull: true
        },
    }, {
        timestamps: true, 
        tableName: 'monthlyservices'
    });

    return MonthlyServiceModel;
};
