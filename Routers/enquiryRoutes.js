const { response } = require('express');
const EnquiryModel = require('../model/enquirymodel');

const router = require('express').Router()
const { GetRegEnquiry, GetUpdateEnquiry, DeleteEnquiryByID, GetAllEnquiry } = require('../Controllers/enquiryControllers')

// register enquiry
router.post('/register', GetRegEnquiry);
// get update the enquiry
router.patch('/update/:id', GetUpdateEnquiry);
// delete by id 
router.get("/delete/:id", DeleteEnquiryByID);
router.get('/getall', GetAllEnquiry);

module.exports = router