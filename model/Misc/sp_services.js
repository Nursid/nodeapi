const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const SpServices = sequelize.define('sp_services', {
        service_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile_no:{
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'sp_services', // You can specify the table name here
    });

    return SpServices;
};
