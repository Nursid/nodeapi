// cust_addpost
const {Sequelize, DataTypes} = require("sequelize");


module.exports = (sequelize) => {
	const CostomerPost = sequelize.define('cust_addpost', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		  },
		  cust_id: {
			type: DataTypes.STRING,
			allowNull: false,
		  },
		  type: {   
			type: DataTypes.STRING
		  },
		  name: {
			type: DataTypes.STRING,
			allowNull: false,
		  },
		  mobile: {
			type: DataTypes.STRING
		  },
		  image: {
			type: DataTypes.STRING,
			allowNull: false
		  },
		  address: {
			type: DataTypes.STRING
		  },
		  property: {
			type: DataTypes.STRING
		  },
		  from_date: {
			type: DataTypes.STRING,
			defaultValue: false
		  },
		  end_date: {
			type: DataTypes.STRING,
		  },
		  issapproved: {
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
		  block: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		  },
	}, {
		timestamps: true,
		tableName: 'cust_addposts', // You can specify the table name here
	});

	return CostomerPost;
};
