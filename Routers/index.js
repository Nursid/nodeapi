const router = require('express').Router()
/*  Account API */
const AccountController = require('../Controllers/AccountController');
const AvailabilityController = require("../Controllers/AvailabilityController")
const LocationModel = require("../Controllers/misc/LocationController")
router.post('/account-listing',AccountController.ListingAccount);
router.post('/add-balance',AccountController.AddBalnace);
router.get('/total-amount',AccountController.TotalAmount);
router.post("/edit-balance/:id",AccountController.EditBalnace);


/*  Availability API */

router.post("/listing-availability",AvailabilityController.GetAllAvailability )
router.post("/add-availability",AvailabilityController.AddAvailability );
router.post("/assign-availability/:mobile_no/:date",AvailabilityController.AssignAvailability);


//  Location API

router.get("/location-listing",LocationModel.ListingLocation )

    
module.exports = router