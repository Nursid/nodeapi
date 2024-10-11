const dbConfig = require("../config/db");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operationsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("connected ....");
  })
  .catch((error) => {
    console.log("Error" + error);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.AdminModel = require("./AuthModels/AdminModel")(sequelize, DataTypes);
db.CustomerModel=require("./AuthModels/CustomerModel")(sequelize, DataTypes);
db.EmployeeModel=require("./AuthModels/EmployeeModel")(sequelize,DataTypes);
db.ServiceProviderModel=require("./AuthModels/ServiceProviderModel")(sequelize,DataTypes);
db.NewCustomerModel=require("./CustomerModels/NewCustomerModal")(sequelize,DataTypes);
db.AddCollectionModel=require("./ExpenseModels/AddCollection")(sequelize,DataTypes)
db.AddExpenseModel=require("./ExpenseModels/AddExpenseModel")(sequelize,DataTypes)
db.HeadExpModel = require("./ExpenseModels/AddHeadExpenseModel")(sequelize,DataTypes)
db.OrderModel=require("./OrderModel/OrderModel")(sequelize,DataTypes)
db.AdminRolesModel=require("./RolesAndPermission/AdminRolesModel")(sequelize,DataTypes)
db.BackofficeRoleModel=require("./RolesAndPermission/BackOfficeModel")(sequelize,DataTypes)
db.ServiceProviderRolesModel=require("./RolesAndPermission/ServiceProviderModel")(sequelize,DataTypes)
db.SuperAdminRolesModel=require("./RolesAndPermission/SuperAdminModel")(sequelize,DataTypes);
db.SuperVisorRolesModel=require("./RolesAndPermission/SupervisorModel")(sequelize,DataTypes);
db.ServiceModel=require("./ServiceModal/ServiceModal")(sequelize, DataTypes);

db.Empservices=require("./Misc/empservices")(sequelize, DataTypes);
db.EnquiryModel=require("./enquirymodel")(sequelize, DataTypes);
db.VerifyModel=require("./VerifyModel")(sequelize, DataTypes);
db.MemberModels=require("./CustomerModels/MemberModels")(sequelize, DataTypes);
db.OrderProcessModel=require("./OrderModel/OrderProcessModel")(sequelize,DataTypes);
db.DepartmentsModel=require("./AuthModels/DepartmentsModel")(sequelize, DataTypes);
db.DesignationModel=require("./AuthModels/DesignationModel")(sequelize, DataTypes);
db.MonthlyServiceModel=require("./AuthModels/MonthlyServiceModel")(sequelize, DataTypes);
db.TestiMonialsModel=require("./ManageWebsiteModels/TestimonialsModel")(sequelize, DataTypes);
db.CustomerPost=require("./ManageWebsiteModels/CustomerPostModel")(sequelize, DataTypes);
db.OfferModel=require("./ManageWebsiteModels/OfferModel")(sequelize,DataTypes);
db.Advertisement=require("./ManageWebsiteModels/AdvertisementModel")(sequelize,DataTypes)
db.InventoryModel=require("./inventories")(sequelize,DataTypes);
db.AllotedItemsModel=require("./AllotedItemsModel")(sequelize,DataTypes);
db.Account= require("./AccountModel")(sequelize,DataTypes);
db.Availability = require("./AvailabilityModel")(sequelize, DataTypes)
db.SpServices = require("./Misc/sp_services")(sequelize, DataTypes)
db.locality=require("./Misc/localities")(sequelize, DataTypes)
db.ComplainModel = require("./ComplainModel")(sequelize, DataTypes)
db.TimeSlotModel = require("./TimeSlotModel")(sequelize, DataTypes)

db.SupervisorAttendance = require("./AttendanceModels/SupervisorAttendance")(sequelize, DataTypes)

db.ServiceProviderAttendance = require("./AttendanceModels/ServiceProviderAttendance")(sequelize, DataTypes)
db.SupervisorAvailability = require("./SupervisorAvailability")(sequelize, DataTypes)



//  relation between model
// db.OrderModel.belongsTo(db.NewCustomerModel, { foreignKey: 'cust_id' });
db.OrderModel.belongsTo(db.NewCustomerModel, {foreignKey: 'cust_id'})
db.NewCustomerModel.hasOne(db.CustomerModel, { foreignKey: 'user_id' });
db.SupervisorAttendance.belongsTo(db.EmployeeModel, { foreignKey: 'emp_id', targetKey: 'emp_id' });
db.CustomerModel.belongsTo(db.NewCustomerModel, { foreignKey: 'user_id' });
// db.OrderModel.belongsTo(db.NewCustomerModel, { foreignKey: 'cust_id' });
db.ComplainModel.belongsTo(db.NewCustomerModel, { foreignKey: 'cust_id' });
db.OrderProcessModel.belongsTo(db.NewCustomerModel, { foreignKey: 'registered_id'});
db.EmployeeModel.belongsTo(db.DepartmentsModel,{foreignKey: 'department_id'});
db.EmployeeModel.belongsTo(db.DesignationModel,{foreignKey: 'designation_id'});
db.EmployeeModel.hasMany(db.Empservices, { foreignKey: 'mobile_no', sourceKey: 'mobile_no' });
db.Empservices.belongsTo(db.EmployeeModel, { foreignKey: 'mobile_no', targetKey: 'mobile_no' });
db.ServiceProviderModel.hasMany(db.SpServices, { foreignKey: 'mobile_no', sourceKey: 'mobile_no' });
db.SpServices.belongsTo(db.ServiceProviderModel, { foreignKey: 'mobile_no', targetKey: 'mobile_no' });

db.ServiceProviderModel.hasMany(db.Availability, { foreignKey: 'emp_id' });
db.Availability.belongsTo(db.ServiceProviderModel, { foreignKey: 'emp_id' });

// db.EmployeeModel.hasMany(db.SupervisorAvailability, {foreignKey: 'emp_id'})
// db.SupervisorAvailability.belongsTo(db.EmployeeModel, {foreignKey: 'emp_id'})

db.EmployeeModel.belongsTo(db.SupervisorAvailability, { foreignKey: 'emp_id', targetKey: 'emp_id' });

// db.EmployeeModel.hasMany(db.SupervisorAvailability, {
//   foreignKey: 'emp_id',
//   targetKey: 'emp_id'  
// });

// db.NewCustomerModel.hasMany(db.CustomerModel,{foreignKey : 'user_id'});



db.sequelize.sync({ force: false }).then(() => {
  console.log("re-sync done!");
});

module.exports = db;
