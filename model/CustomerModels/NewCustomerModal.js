const {Sequelize, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
	const NewCustomer = sequelize.define('NewCustomer', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		  },
		  name: {
			type: DataTypes.STRING,
			allowNull: false
		  },
		  ref_name: {
			type: DataTypes.STRING
		  },
		  email: {
			type: DataTypes.STRING,
		  },
		  mobileno: {
			type: DataTypes.STRING
		  },
		  password: {
			type: DataTypes.STRING,
			
		  },
		  remark: {
			type: DataTypes.STRING
		  },
		  remark1: {
			type: DataTypes.STRING
		  },
		  cancle: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		  },
		  closed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		  },
		  continue: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		  },
		  refrance_name: {
			type: DataTypes.STRING
		  },
		  direct: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		  },
		  issapproved: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		  },
		  ismember: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		  },
		  block: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		  },
		  create_date: {
			type: DataTypes.DATE,
			defaultValue: Sequelize.NOW
		  }
	}, {
		timestamps: false,
		tableName: 'new_customers', // You can specify the table name here
	});

	// Sequelize "beforeSave" hook
	NewCustomer.beforeSave((newCustomer, options) => {
		newCustomer.updatedAt = new Date();
	});

	return NewCustomer;
};
