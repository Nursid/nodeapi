// offfers
const {Sequelize, DataTypes} = require("sequelize");

// `id`, `description`, `image`, `is_approved`, `block`, 
module.exports = (sequelize) => {
	const OfferModel = sequelize.define('offer', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		  },
          description: {
			type: DataTypes.STRING,
            allowNull: false
		  },
          image: {
			type: DataTypes.STRING,
            allowNull: false
		  },
          is_approved: {
			type: DataTypes.BOOLEAN,
            defaultValue: false
		  },
          block: {
			type: DataTypes.BOOLEAN,
            defaultValue: false
		  },
        }, {
            timestamps: true,
            tableName: 'offers', // You can specify the table name here
        });
    
        return OfferModel;
    };
    