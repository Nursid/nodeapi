const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SuperVisorRolesModel = sequelize.define('supervisor_roles', {
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Dashboard: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Attendence: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AttendenceEmployee: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AttendenceServiceProvider: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AttendenceReport: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AttendenceModify: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Availability: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Expenses: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AddHeadExpence: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AddExpense: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AddCollections: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    TodaysReport: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AllTransactionReport: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageHR: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageEmployee: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageServiceProvider: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageMonthService: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageService: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManagePage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageTestimonial: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageOffer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManagePost: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageAdvertisement: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Customer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageCustomer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageHistory: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    MonthlyMembers: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageEnquiry: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    RolesAndPermission: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "supervisor_roles",
  }
  );

  return SuperVisorRolesModel;
};
