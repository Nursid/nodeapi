const { allow } = require("joi");
const {Sequelize, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
const MemberModels = sequelize.define('members', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false
    },
    service_type: {
      type: DataTypes.STRING
    },
    bill: {
      type: DataTypes.DECIMAL(10, 2) // Assuming bill is a decimal value
    },
    last_pay_date: {
      type: DataTypes.DATE
    },
    remark: {
      type: DataTypes.STRING
    },
  }, {
    tableName: 'members', // Name of the table in the database
    timestamps: allow // If you want Sequelize to manage createdAt and updatedAt fields
  });
  return MemberModels
}
  