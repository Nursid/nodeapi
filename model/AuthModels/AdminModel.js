const { Sequelize, DataTypes } = require("sequelize");// Make sure to replace this with your Sequelize instance
module.exports = (sequelize) => {
const AdminModel = sequelize.define('Admin', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobileNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'admins' // You can specify the table name here
});
return AdminModel;
}
