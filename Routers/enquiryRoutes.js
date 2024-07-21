const { response } = require('express');
const EnquiryModel = require('../model/enquirymodel');

const router = require('express').Router()

const enquiryControllers=require("../Controllers/enquiryControllers")

// register enquiry
router.post('/register', enquiryControllers.createEnquiry);
// get update the enquiry
router.post('/update/:id', enquiryControllers.updateEnquiry);
// delete by id 
router.delete("/delete/:id", enquiryControllers.deleteEnquiryByID);
router.get('/getall', enquiryControllers.getAllEnquiries);

module.exports = router