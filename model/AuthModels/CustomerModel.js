const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const CustomerModel = sequelize.define('customers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          user_id: {
            type: DataTypes.BIGINT,
            allowNull: true
          },
          gender: {
            type: DataTypes.ENUM('Female', 'Male', 'Other', ''),
            allowNull: true
          },
          age: {
            type: DataTypes.STRING,
            allowNull: true
          },
          address: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          land_mark: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          location: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          mobile: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          tel_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          office_no: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          alternate_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          aadhar_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          occupation: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          designation: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          own_house: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          dob: {
            type: DataTypes.STRING,
            allowNull: true
          },
          doa: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          spouse_name: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          spouse_name1: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          spouse_dob1: {
            type: DataTypes.STRING,
            allowNull: true
          },
          spouse_name2: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          spouse_dob2: {
            type: DataTypes.STRING,
            allowNull: true
          },
          spouse_dob: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          image: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          payment: {
            type: DataTypes.BIGINT,
            allowNull: true
          },
          discount_amount: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          recieved_amount: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          balance_amount: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          payment_method: {
            type: DataTypes.STRING(300),
            allowNull: true
          },
          service: {
            type: DataTypes.STRING,
            allowNull: true
          },
          service1: {
            type: DataTypes.STRING,
            allowNull: true
          },
          service2: {
            type: DataTypes.STRING,
            allowNull: true
          },
          service3: {
            type: DataTypes.STRING,
            allowNull: true
          },
          service4: {
            type: DataTypes.STRING,
            allowNull: true
          },
          service5: {
            type: DataTypes.STRING,
            allowNull: true
          },
          username: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          reference: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          familyMember: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          membership: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          is_approved: {
            type: DataTypes.BOOLEAN,
            allowNull: true
          },
          member_id: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          is_block: {
            type: DataTypes.BOOLEAN,
            allowNull: true
          },
          todate: {
            type: DataTypes.STRING,
            allowNull: true
          },
          validtodate: {
            type: DataTypes.STRING,
            allowNull: true
          }
    }, 
   {
        timestamps: true,
        tableName: 'customers'
    });

    return CustomerModel;
};
