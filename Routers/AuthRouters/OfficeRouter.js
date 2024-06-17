const router = require('express').Router()
const officeRouters = require('../../Controllers/AuthControllers/OfficeControllers')
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

// add serviceProvier Route
router.post("/add",upload.fields([
  { name: 'pan_image', maxCount: 1 },
  { name: 'adhar_image', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), officeRouters.AddEmployee);
// Login In service provider
router.get("/login/:logger", officeRouters.LoginEmployee)
// update the service provider 
router.post("/update/:id", upload.fields([
  { name: 'pan_image', maxCount: 1 },
  { name: 'adhar_image', maxCount: 1 },
  { name: 'image', maxCount: 1 }

]), officeRouters.UpdateTheEmployeeData);
// Delete The service PRovider 
router.get("/delete/:id", officeRouters.DeleteTheEmployeeData);
// delete all the service provider 
router.delete("/deleteall", officeRouters.DeleteAllEmployeeData);
// get all the service provider 
router.get("/getall", officeRouters.GetAllEmployeeData);
// get the single service provider 
router.get("/get/:id", officeRouters.GetEmployeeById);

router.post('/block/:id',officeRouters.UpdateEmployeeStatus);




router.get("/getall/supervisor",officeRouters.GetAllSupervisor)

// send notification on mobile number 
// router.get("/send-notification/:number")







module.exports = router