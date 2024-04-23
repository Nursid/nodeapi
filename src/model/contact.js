const {Sequelize, DataTypes} = require("sequelize");
module.exports=(Sequelize) =>{
   const Contact=Sequelize.define("contact",{
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    message: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
 }, {
		tableName: "contact",
		timestamps: true
  })
  return Contact;
}