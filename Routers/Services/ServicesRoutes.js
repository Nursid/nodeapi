const router = require("express").Router()
const { AddService, GetAllServices, DeleteServices, UpdateService, GetSingleServiceData, DeleteByID, GetTheService, BlockUpdate } = require("../../Controllers/Services/ServicesController")


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


// add the service 
router.post('/add',upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 }
  ]),  AddService);
// get all the service 
router.get("/getall", GetAllServices);
// for sigle data
router.post("/get", GetAllServices);
// get single data
router.get("/get-service/:id", GetSingleServiceData);
// delete by sevice id 

// delete by params id 
router.get("/deleteservice/:id", DeleteByID);
// update the service 
router.post("/update/:id",upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 }
  ]), UpdateService);

// search for service
router.get("/search", GetTheService);
router.put('/block/:id',BlockUpdate)



module.exports = router 
