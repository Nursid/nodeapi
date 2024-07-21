const router = require("express").Router();
const serviceProviderRouter = require("../../Controllers/AuthControllers/ServiceProviderController");

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
    { name: 'image', maxCount: 1 },
    { name: 'document1', maxCount: 1 },
    { name: 'document2', maxCount: 1 },
    { name: 'document3', maxCount: 1 }]), serviceProviderRouter.AddServiceProvider);
// Login In service provider
router.get("/login", serviceProviderRouter.LoginServiceProvider)
// update the service provider 
router.post("/update/:id",
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document1', maxCount: 1 },
    { name: 'document2', maxCount: 1 },
    { name: 'document3', maxCount: 1 }]),
  serviceProviderRouter.UpdateTheServiceProvider);
// Delete The service PRovider 
router.get("/delete/:id", serviceProviderRouter.DeleteTheServiceProvider);
// delete all the service provider 
router.post("/block/:id", serviceProviderRouter.BlockServiceProvider);
// get all the service provider 
router.get("/getall", serviceProviderRouter.GetAllTheServiceProvider);
// get the single service provider 
router.get("/get/:id", serviceProviderRouter.GetDataById);



// send notification on mobile number 
// router.get("/send-notification/:number")




module.exports = router