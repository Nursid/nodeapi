const {Sequelize, DataTypes} = require("sequelize");

// company_name
// advertisements


// (`id`, `company_name`, `gst_no`, `payment`, `mobile`, `start_date`, `end_date`, `image`, `block`, `created_at`, `updated_at`)
module.exports = (sequelize) => {
	const Advertisement = sequelize.define('advertisement', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		  },
        company_name: {
			type: DataTypes.STRING,
		  },
          gst_no: {
			type: DataTypes.STRING,
		  },
          payment: {
			type: DataTypes.STRING,
		  },
          mobile: {
			type: DataTypes.STRING,
		  },
          start_date: {
			type: DataTypes.STRING,
		  },
          end_date: {
			type: DataTypes.STRING,
		  },
          image: {
			type: DataTypes.STRING,
		  },
		  block: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		  },
	}, {
		timestamps: true,
		tableName: 'advertisements', // You can specify the table name here
	});

	return Advertisement;
};