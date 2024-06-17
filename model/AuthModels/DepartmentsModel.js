
const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
// Define the Department model
const DepartmentsModel = sequelize.define('department', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    timestamps: true, // Disable Sequelize's default timestamps
    tableName: 'departments' // Define the table name explicitly
  });
  
  return DepartmentsModel;
};
