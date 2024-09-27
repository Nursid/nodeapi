const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ServiceProviderModel = sequelize.define('service_providers', {
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
            allowNull: true
          },
          last_name: {
            type: DataTypes.STRING,
            allowNull: true
          },
          username: {
            type: DataTypes.STRING,
            allowNull: true
          },
          mobile_no: {
            type: DataTypes.STRING,
            allowNull: false
          },
          aadhar_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          pan_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          email: {
            type: DataTypes.STRING,
            allowNull: true
          },
          doj: {
            type: DataTypes.STRING,
            allowNull: true
          },
          permanent_address: {
            type: DataTypes.STRING,
            allowNull: true
          },
          current_address: {
            type: DataTypes.STRING,
            allowNull: true
          },
          ref_name: {
            type: DataTypes.STRING,
            allowNull: true
          },
          ref_address: {
            type: DataTypes.STRING,
            allowNull: true
          },
          ref_aadhar_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          ref_mobile_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          ref_city: {
            type: DataTypes.STRING,
            allowNull: true
          },
          ref_area: {
            type: DataTypes.STRING,
            allowNull: true
          },
          location: {
            type: DataTypes.STRING,
            allowNull: true
          },
          is_approved: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
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
            allowNull: true
          },
          supervisor_type: {
            type: DataTypes.STRING,
            allowNull: true
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
