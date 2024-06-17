const router = require("express").Router()
const { AddService, GetAllServices, DeleteServices, UpdateService, GetSingleServiceData, DeleteByID, GetTheService, BlockUpdate } = require("../../Controllers/Services/ServicesController")


// add the service 
router.post('/add', AddService);
// get all the service 
router.get("/getall", GetAllServices);
// for sigle data
router.post("/get", GetAllServices);
// get single data
router.get("/get-service/:id", GetSingleServiceData);
// delete by sevice id 
router.post("/deleteservice", DeleteServices);

// delete by params id 
router.get("/deleteservice/:id", DeleteByID);
// update the service 
router.patch("/update", UpdateService);

// search for service
router.get("/search", GetTheService);


router.put('/block/:id',BlockUpdate)



module.exports = router 
