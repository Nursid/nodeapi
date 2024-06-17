// `id` int NOT NULL,
// `allotdate` date NOT NULL,
// `spname` varchar(100) NOT NULL,
// `item` varchar(100) NOT NULL,
// `aqty` int NOT NULL,
// `remark` varchar(200) NOT NULL

const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const AllotedItems = sequelize.define('alloted_items', {
        allotdate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        spname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        item: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        aqty: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    }, {
        timestamps: true,
        tableName: 'alloted_items',
    });
    return AllotedItems;
};
