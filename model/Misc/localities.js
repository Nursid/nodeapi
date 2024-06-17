const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const locality = sequelize.define('localities', {
        location_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
        tableName: 'localities', // You can specify the table name here
    });

    return locality;
};
