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
	GetOrderAssing,
	GetOrderAssingwithStatus,
	GetLastOrderByMobile,
    GetOrderAssingwithSupervisor
} = require("../../Controllers/ordercontroller/ordercontrollers");

const router = require("express").Router();

// book order

router.post('/add/:id', GetOrderNow);
router.patch("/update/:id", GetOrderUpdate)
router.get("/get/:id/:cust_id", GetSingleOrder);
router.get("/delete/:order_no", GetDeleteByID)
router.post("/cancel/:order_no", GetCancel)
router.get("/hold/:order_no/:cust_id", GetHold)
router.get("/complete/:order_no", GetCompleted)
router.get("/getall", GetAllOrders)
router.get("/getall/:status", GetByStatus)
router.get("/getorderById/:id", GetOrderByID)
router.post("/add-complain", OrderComplain)
router.put("/assign/:id", OrderAssing)
router.get("/getall/service/:id", GetOrderAssing)


router.get("/getall/supervisor/:id", GetOrderAssingwithSupervisor)

// order/getall/33/4order/getall/33/4
router.get('/getall/:sup_id/:status_id', GetOrderAssingwithStatus)


router.get("/get-last-service", GetLastOrderByMobile)


module.exports = router;
