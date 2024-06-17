const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ServiceModel = sequelize.define('services', {
    serviceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
    },
    adminStatus: {
      type: DataTypes.STRING,
    },
    block: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    service_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: true,
  },{
    timestamps: true,
    tableName: "services"
  }
  
  );

  return ServiceModel;
};
