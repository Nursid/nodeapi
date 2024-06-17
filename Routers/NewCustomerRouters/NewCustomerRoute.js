const express = require('express');
const router = express.Router();
const customerController = require('./../../Controllers/CustomerControllers/NewCustomerController');

// Create a new customer
router.post('/create/new/customer', customerController.createNewCustomer);

// Get all customers
router.get('/all/customers', customerController.getAllNewCustomers);

// Get a specific customer by ID
router.get('/get/customer/:id', customerController.getNewCustomerById);

// Update a customer by ID
router.put('/update/customer/:id', customerController.updateNewCustomerById);

// Delete a customer by ID
router.delete('/delete/customer/:id', customerController.deleteNewCustomerById);

router.get("/get/customerByMobile/:mobileno",customerController.getCustomerByMobile);

module.exports = router;