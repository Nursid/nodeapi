const {
	GetByStatus,
	GetHold,
	GetCancel,
	GetAllOrders,
	GetOrderNow,
	GetOrderUpdate,
	GetSingleOrder,
	GetDeleteByID,
	GetCompleted,
	GetOrderByID,
	OrderComplain,
	OrderAssing,
	OrderCheckOut,
	OrderCheckIn,
	GetOrderAssing,
	GetOrderAssingwithStatus,
    GetOrderAssingwithSupervisor,
	GetTotalSummary,
	GetTimeSlot,
	GetOrderAssingServiceProvider,
	AddOrderCustomer,
	GetReports,
	GetOrderByOrderNo,
	AddDueBeforeOneday,
	OrderAssingSupervisor,
	GetOrderReports,
	AssignServiceProviderAvailability
} = require("../../Controllers/ordercontroller/ordercontrollers");

const AuthenticateToken = require('../../Middleware/AuthenticateToken')
const router = require("express").Router();

// book order
router.post('/add',GetOrderNow);
router.patch("/update/:id", GetOrderUpdate)
router.get("/get/:id/:cust_id", GetSingleOrder);
router.get("/delete/:order_no", AuthenticateToken, GetDeleteByID)
router.post("/cancel/:order_no", GetCancel)
router.get("/hold/:order_no", GetHold)
router.get("/complete/:order_no", GetCompleted)
router.get("/getall", GetAllOrders)
router.get("/getall/:status", GetByStatus)
router.get("/getorderById/:id", GetOrderByID)
router.post("/add-complain", OrderComplain)
router.put("/assign/:id", OrderAssing)
router.post("/assign-service-provider/:order_no", GetOrderAssing)
router.put("/assign-supervisor/:order_no", OrderAssingSupervisor)
router.get("/getall/supervisor/:id", GetOrderAssingwithSupervisor)
router.get('/getall/:sup_id/:status_id', GetOrderAssingwithStatus)
router.get("/filter-order", GetTotalSummary)
router.get("/time-slot", GetTimeSlot)
router.get("/getall-service-provider/:id", GetOrderAssingServiceProvider)
router.post("/add-customer-order", AddOrderCustomer)
router.get("/getbyorderno/:order_no", GetOrderByOrderNo)
router.post("/add-due-order", AddDueBeforeOneday)

// report API 
router.post("/reports/:type", GetReports)
router.post("/order-reports", GetOrderReports)
router.put("/check-in", OrderCheckIn)
router.put("/check-out", OrderCheckOut)
router.put("/assign-service-provider", AssignServiceProviderAvailability)

module.exports = router;
