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

  const compressImageIfLarge = (req, res, next) => {
    if (req.file && req.file.size > 500 * 1024  ) {
      sharp(req.file.path)
        .rotate() 
        .resize({ width: 1080, height: 1920, withoutEnlargement: true })
        .jpeg({ quality: 40 })
        .toBuffer((err, data, info) => {
          if (err) {
            return next(err);
          }
          fs.writeFile(req.file.path, data, (err) => {
            if (err) {
              return next(err);
            }
            next();
          });
        });
    } else {
      next();
    }
  };
  
const upload = multer({ storage: storage });

router.post("/signup", upload.single('image'),compressImageIfLarge, customerRouter.SignupUser);
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