
const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
const DesignationModel = sequelize.define('designation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guard_name: {
    type: DataTypes.STRING
  },
}, {
  timestamps: true, // Disable Sequelize's default timestamps
  tableName: 'designations' // Define the table name explicitly
});

return DesignationModel;
}
