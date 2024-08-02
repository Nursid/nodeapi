const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const ServiceProviderAttendance = sequelize.define('serviceProviderAttendance', {
    servp_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    in_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    check_in: {
      type: DataTypes.TIME,
      allowNull: true
    },
    out_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    check_out: {
      type: DataTypes.TIME,
      allowNull: true
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'serviceProviderAttendance',
  });

  return ServiceProviderAttendance
}