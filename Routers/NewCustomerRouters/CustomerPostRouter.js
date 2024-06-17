const express = require('express');
const router = express.Router();
const customerController = require('./../../Controllers/CustomerControllers/CustomerPostController');

const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // Uploads will be stored in the 'uploads' directory
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname); // Unique filename
	}
});
const upload = multer({storage: storage});
router.post("/create", 
upload.fields([
    { name: 'image', maxCount: 1 }
])
, customerController.AddCustomerPost);
module.exports = router;
