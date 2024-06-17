const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const OrderProcess = sequelize.define("order_process", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        order_no:{
            type: DataTypes.INTEGER,

        },
        membership: {
            type: DataTypes.STRING
        },
        name:{
            type:DataTypes.STRING
        },
        email:{
            type: DataTypes.STRING
        },
        age:{
            type:DataTypes.INTEGER,
        },

        mobile:{
            type: DataTypes.STRING
        },
        address:{
            type: DataTypes.STRING
        },
        city:{
            type: DataTypes.STRING
        },
        zip_code:{
            type: DataTypes.INTEGER
        },
        registered_id:{
            type: DataTypes.STRING
        },
        service_des:{
            type: DataTypes.STRING
        },
        approx_duration:{
            type:DataTypes.STRING
        },
        supervisor_name:{
            type: DataTypes.STRING
        },
        lst_serv_date:{
            type: DataTypes.STRING
        },
        lst_serv_type:{
            type: DataTypes.STRING
        },
        services:{
            type: DataTypes.STRING
        },
        serviceDateTime: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'order_process',
    });

    return OrderProcess;
};

