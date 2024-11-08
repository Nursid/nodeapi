require("dotenv").config();
require("./connection");
const multer = require("multer");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const CustomerRouter = require("./Routers/AuthRouters/customerRouter");
const ServiceRouter = require("./Routers/Services/ServicesRoutes");
const utilRouter = require("./Routers/utils");
const RolesRoutes = require("./Routers/RolesManageRoutes/RolesRoutes");
const EmployeeRoutes = require("./Routers/AuthRouters/OfficeRouter");
const ServiceRoutes = require("./Routers/AuthRouters/ServiceProviderRoutes");
const OrderRouters = require("./Routers/OrdersRoutes/BookingRoutes");
const EnquiryRouters = require("./Routers/enquiryRoutes");
const ExpenseRouters = require("./Routers/ExpensesRouters/ExpenseRouters");
const SuperAdminRoutes = require("./Routers/AuthRouters/SuperAdminRoutes");
const VerifyRoutes = require("./Routers/Verify");
const NewCustomerRoutes = require("./Routers/NewCustomerRouters/NewCustomerRoute")
const DepartmentsRouter=require("./Routers/DepartmentsRouter");
const DesignationRouter=require("./Routers/DesignationRouter")
const MemberRoutes=require("./Routers/NewCustomerRouters/MemberRouter");
const MonthlyService=require("./Routers/AuthRouters/MonthlyServiceRouter");
const ManageWebsite = require("./Routers/ManageWebsiteRouters/")
const CustomerPost= require("./Routers/NewCustomerRouters/CustomerPostRouter")
const InventoryRouter=require("./Routers/InventryRouter")
const complain = require("./Routers/ComplainRouter")
const Attendance = require("./Routers/AttendanceRouters")
const app = express();
const route= require("./Routers/index")
app.use(cors());
app.use(express.json());

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({  
  extended: true
}));

app.use("/uploads", express.static("uploads"));

app.use(
  cookieSession({
    name: "session",
    keys: ["helpers"],
    maxAge: 24 * 60 * 60 * 1000, // Fixed: Correct the maxAge value to milliseconds
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes section
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({path: __dirname});
});
app.use("/api",route)
app.use("/customer", CustomerRouter);
app.use("/service", ServiceRouter);
app.use("/expense", ExpenseRouters);
app.use("/employee", EmployeeRoutes);
app.use("/service-provider", ServiceRoutes);
app.use("/roles", RolesRoutes);
app.use("/admin", SuperAdminRoutes);
app.use("/util", utilRouter);
app.use("/order", OrderRouters);
app.use("/enquiry", EnquiryRouters);
app.use("/verify", VerifyRoutes);
app.use('/', NewCustomerRoutes)
app.use("/members",MemberRoutes);
app.use("/department",DepartmentsRouter);
app.use("/designation",DesignationRouter);
app.use("/monthly-service",MonthlyService);
app.use("/manage-website",ManageWebsite);
app.use("/post",CustomerPost);
app.use("/inventry",InventoryRouter)
app.use("/complain",complain)
app.use("/attendance",Attendance)

// Start the server
app.listen(5000, () => {
  console.log(`Server started at port 5000`);
});
