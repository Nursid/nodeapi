const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const SupervisorAttendance = sequelize.define('supervisorAttendance', {
    emp_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    in_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
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
    tableName: 'supervisorAttendance',
  });

  return SupervisorAttendance
}