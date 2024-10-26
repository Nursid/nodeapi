const router = require("express").Router()
const customerRouter = require("../../Controllers/AuthControllers/CustomerControllers")
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

router.post("/signup", upload.single('image'),customerRouter.SignupUser);
// login the user 
router.get("/login",customerRouter.LoginUser);
// delete all 
router.delete("/deleteall", customerRouter.DeleteUsers);
// delete by id  
router.get('/delete/:id', customerRouter.GetDeleteCustomerById)
// all customers
router.get("/getall", customerRouter.AllCustomer);
// all customers
router.get("/getbyid/:id", customerRouter.GetCustomer);
// get the single user by id
router.post("/get", customerRouter.AllCustomer);
// update the customer data
router.put('/getupdate/:user_id', upload.single('image'),customerRouter.GetUpdateTheCustomer)

router.post('/block/:id',customerRouter.UpdateStatus)



module.exports = router