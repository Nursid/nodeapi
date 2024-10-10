const router = require('express').Router()
/*  Account API */
const AccountController = require('../Controllers/AccountController');
const AvailabilityController = require("../Controllers/AvailabilityController")
const LocationModel = require("../Controllers/misc/LocationController")
const supervisorAvailabilityController = require("../Controllers/SupervisorAvailabilityController")


router.get('/account-listing',AccountController.ListingAccount);
router.post('/add-balance',AccountController.AddBalance);
router.get('/total-amount',AccountController.TotalAmount);
router.post("/edit-balance/:id",AccountController.EditBalnace);


/* Service Provider  Availability API */

router.post("/listing-availability",AvailabilityController.GetAllAvailability )
router.post("/add-leave",AvailabilityController.AddLeave );
router.post("/assign-availability/:mobile_no/:date",AvailabilityController.AssignAvailability);
router.post("/transfer-availability",AvailabilityController.TransferAvailability);



/* Supervisor  Availability API */
router.post("/supervisor-availability-list",supervisorAvailabilityController.GetAllSupervisorAvailability )
router.post("/supervisor-add-leave",supervisorAvailabilityController.AddLeave );
router.post("/supervisor-assign-availability/:mobile_no/:date",supervisorAvailabilityController.AssignAvailability);
router.post("/supervisor-transfer-availability",supervisorAvailabilityController.TransferAvailability);


//  Location API

router.get("/location-listing",LocationModel.ListingLocation )


    
module.exports = router