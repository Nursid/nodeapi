const router = require('express').Router()

const { Router } = require('express')
const MonthlyServiceController=require("../../Controllers/AuthControllers/MonthlyServiceController")

router.post("/add",MonthlyServiceController.AddMonthlyService);
router.get("/getall",MonthlyServiceController.GetAllMonthlyService);
router.delete("/delete/:id",MonthlyServiceController.DeleteMonthlyService);
router.post("/update/:id",MonthlyServiceController.UpdateMonthlyService);


module.exports = router;