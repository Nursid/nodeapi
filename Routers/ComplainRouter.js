// routes/complainRoutes.js

const express = require('express');
const router = express.Router();
const complainController = require('../Controllers/ComplainController');

// GET all complains
router.get('/getall', complainController.getAllComplains);

// GET a complain by ID
router.get('/get/:id', complainController.getComplainById);

// POST a new complain
router.post('/add', complainController.createComplain);

// PUT update a complain by ID
router.post('/update/:id', complainController.updateComplain);

// DELETE a complain by ID
router.delete('/delete/:id', complainController.deleteComplain);

router.put('/assing/:id', complainController.ComplainAssing);



module.exports = router;
