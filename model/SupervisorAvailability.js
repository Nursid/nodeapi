const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ServiceProviderAvailability = sequelize.define('supervisor_availabilities', {
        date: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        emp_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "07:00-07:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "07:30-08:00": {
            type: DataTypes.STRING,
            allowNull: true,
        }, 
        "08:00-08:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "08:30-09:00": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "09:00-09:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "09:30-10:00": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "10:00-10:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "10:30-11:00": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "11:00-11:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "11:30-12:00": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "12:00-12:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "12:30-01:00": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "01:00-01:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "01:30-02:00": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "02:00-02:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "02:30-03:00": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "03:00-03:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "03:30-04:00": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "04:00-04:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "04:30-05:00": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "05:00-05:30": {
            type: DataTypes.STRING,
            allowNull: true,
        },
        "05:30-06:00": {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'supervisor_availabilities',
    });
    return ServiceProviderAvailability;
};