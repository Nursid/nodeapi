const router = require('express').Router()

const { Router } = require('express')
const MonthlyServiceController=require("../../Controllers/AuthControllers/MonthlyServiceController")

const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Uploads will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname); // Unique filename
    },
  });

const upload = multer({ storage: storage });

router.post("/add",upload.fields([
    { name: 'before_cleaning', maxCount: 1 },
    { name: 'after_cleaning', maxCount: 1 }
  ]), MonthlyServiceController.AddMonthlyService);

router.get("/getall",MonthlyServiceController.GetAllMonthlyService);
router.delete("/delete/:id",MonthlyServiceController.DeleteMonthlyService);
router.post("/update/:id",upload.fields([
    { name: 'before_cleaning', maxCount: 1 },
    { name: 'after_cleaning', maxCount: 1 }
  ]), MonthlyServiceController.UpdateMonthlyService);

router.put("/assign/:id", MonthlyServiceController.MonthlyServiceAssign)




module.exports = router;