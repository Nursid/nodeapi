const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const OrderServiceProviders = sequelize.define("orderserviceproviders", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        order_no:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        service_provider_id:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
    },
    {
   timestamps: true,
   tableName: 'orderserviceproviders',
});

return OrderServiceProviders;
};
