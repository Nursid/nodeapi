const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ServiceProviderModel = sequelize.define('ServiceProvider', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          first_name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          last_name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false
          },
          mobile_no: {
            type: DataTypes.STRING,
            allowNull: false
          },
          aadhar_no: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          pan_no: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          doj: {
            type: DataTypes.DATE,
            allowNull: false
          },
          permanent_address: {
            type: DataTypes.STRING,
            allowNull: false
          },
          current_address: {
            type: DataTypes.STRING,
            allowNull: false
          },
          ref_name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          ref_address: {
            type: DataTypes.STRING,
            allowNull: false
          },
          ref_aadhar_no: {
            type: DataTypes.STRING,
            allowNull: false
          },
          ref_mobile_no: {
            type: DataTypes.STRING,
            allowNull: false
          },
          ref_city: {
            type: DataTypes.STRING,
            allowNull: false
          },
          ref_area: {
            type: DataTypes.STRING,
            allowNull: false
          },
          location: {
            type: DataTypes.STRING,
            allowNull: false
          },
          is_approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
          },
          service_id: {
            type: DataTypes.STRING,
            allowNull: true
          },
          about: {
            type: DataTypes.TEXT,
            allowNull: true
          },
          image: {
            type: DataTypes.STRING,
            allowNull: true
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false
          },
          supervisor_type: {
            type: DataTypes.STRING,
            allowNull: false
          },
          document1_name: {
            type: DataTypes.STRING,
            allowNull: true
          },
          document1: {
            type: DataTypes.STRING,
            allowNull: true
          },
          document2_name: {
            type: DataTypes.STRING,
            allowNull: true
          },
          document2: {
            type: DataTypes.STRING,
            allowNull: true
          },
          document3_name: {
            type: DataTypes.STRING,
            allowNull: true
          },
          document3: {
            type: DataTypes.STRING,
            allowNull: true
          },
          block_id: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          },
          work_as: {
            type: DataTypes.STRING,
            allowNull: true
          },
          emp_type: {
            type: DataTypes.STRING,
            allowNull: true
          },
          emp_id: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          provider_type: {
            type: DataTypes.STRING,
            allowNull: true
          },
          r1: {
            type: DataTypes.STRING,
            allowNull: true
          },
          r5: {
            type: DataTypes.STRING,
            allowNull: true
          },
          role:{
            type: DataTypes.STRING,
            default:"Service Provider"
          }

        }, {
        timestamps: true, // If you don't want createdAt and updatedAt columns
        tableName: 'service_providers'
    });

    return ServiceProviderModel;
};
