const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const ServiceProviderAttendance = sequelize.define('serviceProviderAttendance', {
    emp_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'serviceProviderAttendance',
  });

  return ServiceProviderAttendance
}