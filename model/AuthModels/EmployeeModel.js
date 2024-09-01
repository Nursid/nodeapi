const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const EmployeeModel = sequelize.define('employee', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          department_id: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          designation_id: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          mobile_no: {
            type: DataTypes.STRING,
            allowNull: false
          },
          alterno: {
            type: DataTypes.STRING,
            allowNull: false
          },
          aadhar_no: {
            type: DataTypes.STRING
          },
          pan_no: {
            type: DataTypes.STRING
          },
          doj: {
            type: DataTypes.DATE
          },
          image: {
            type: DataTypes.STRING
          },
          address: {
            type: DataTypes.STRING
          },
          emp_id: {
            type: DataTypes.STRING
          },
          is_approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          },
          about: {
            type: DataTypes.TEXT
          },
          document1_name: {
            type: DataTypes.STRING
          },
          adhar_image: {
            type: DataTypes.STRING
          },
          document2_name: {
            type: DataTypes.STRING
          },
          pan_image: {
            type: DataTypes.STRING
          },
          document3_name: {
            type: DataTypes.STRING
          },
          document3: {
            type: DataTypes.STRING
          },
          salary: {
            type: DataTypes.NUMBER
          },
          duty_hours: {
            type: DataTypes.STRING
          },
          week_off: {
            type: DataTypes.STRING
          },
          is_block: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          },
        },   {
        timestamps: true, 
        tableName: 'employees'
    });

    return EmployeeModel;
};
