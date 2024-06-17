const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const EmpID = sequelize.define('empservices', {
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
        tableName: 'empservices', // You can specify the table name here
    });

    return EmpID;
};
