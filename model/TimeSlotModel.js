const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const TimeSlotModel = sequelize.define('time_slot', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        time_range: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: true,
        tableName: 'time_slot'
    });

    return TimeSlotModel;
};