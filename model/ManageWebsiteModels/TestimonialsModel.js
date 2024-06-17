const { Sequelize, DataTypes } = require("sequelize");// Make sure to replace this with your Sequelize instance
module.exports = (sequelize) => {
const AdminModel = sequelize.define('Testimonial', {

  // `id`, `name`, `mobile`, `email`, `occupation`, `image`, `address`, `about`, `created_at`, `is_approved`, `block`, `updated_at`
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  about: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  block: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'testimonials' // You can specify the table name here
});
return AdminModel;
}
