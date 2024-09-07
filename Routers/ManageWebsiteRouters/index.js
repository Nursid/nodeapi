const router = require("express").Router();
const multer = require('multer');
const TestimonialsController = require("../../Controllers/ManageTestimonialsControllers/TestimonialsController");

const {
	AddCustomerPost,
	UpdateCustomerPost,
	GetAllPost,
	BlockPostUpdate,
	DeletePost,
	ApprovePostUpdate
} = require("../../Controllers/ManageTestimonialsControllers/PostConstroller");

const OfferConstroller = require("../../Controllers/ManageTestimonialsControllers/OfferConstroller")

const AdvertisementController =require("../../Controllers/ManageTestimonialsControllers/AdevertisementController") 

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // Uploads will be stored in the 'uploads' directory
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname); // Unique filename
	}
});
const upload = multer({storage: storage});

//  manage Post Router 
router.post("/post/create", upload.fields([{
		name: 'image',
		maxCount: 1
	}]), AddCustomerPost);

router.post("/post/update/:id", upload.fields([{
	name: 'image',
	maxCount: 1
}]), UpdateCustomerPost);	
router.get("/post/getall", GetAllPost);
router.delete("/post/delete/:id", DeletePost);
router.put("/post/block/:id", BlockPostUpdate);
router.put("/post/approve/:id", ApprovePostUpdate);

// Manage testimonils Router 

router.get("/testimonial/getall",TestimonialsController.GetAllTestimonials);
router.delete("/testimonial/delete/:id", TestimonialsController.DeleteTestimonials);
router.put("/testimonial/block/:id", TestimonialsController.BlockUpdate);
router.put("/testimonial/approve/:id", TestimonialsController.ApprovedTestimonialUpdate);
// ApprovedTestimonialUpdate
router.post("/testimonial/create", upload.fields([{
	name: 'image',
	maxCount: 1
}]), TestimonialsController.AddCustomerTestimonial);

router.post("/testimonial/update/:id", upload.fields([{
name: 'image',
maxCount: 1
}]), TestimonialsController.UpdateCustomerTestimonial);	

// manage Offers Router 

router.get("/offer/getall", OfferConstroller.GetAllOffer);
router.delete("/offer/delete/:id", OfferConstroller.DeleteOffer);
router.put("/offer/block/:id", OfferConstroller.BlockOfferUpdate);
router.put("/offer/approve/:id", OfferConstroller.ApprovedOfferUpdate);
router.post("/offer/create", upload.fields([{
	name: 'image',
	maxCount: 1
}]), OfferConstroller.AddCustomerOffer);

router.post("/offer/update/:id", upload.fields([{
name: 'image',
maxCount: 1
}]), OfferConstroller.UpdateCustomerOffer);	



//manange Adervertisements 

router.get("/advertisements/getall", AdvertisementController.GetAllAdvertisement);
router.delete("/advertisements/delete/:id", AdvertisementController.DeleteAdvertisement);
router.put("/advertisements/block/:id", AdvertisementController.BlockAdvertisementUpdate);
router.post("/advertisements/create", upload.fields([{
	name: 'image',
	maxCount: 1
}]), AdvertisementController.AddCustomerAdvertisement);

router.post("/advertisements/update/:id", upload.fields([{
name: 'image',
maxCount: 1
}]), AdvertisementController.UpdateCustomerAdvertisement);	




module.exports = router
