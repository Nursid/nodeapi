const router = require("express").Router();
const SuperAdminRouter = require("../../Controllers/AuthControllers/AdminAuthController")


// make admin 
router.post("/add", SuperAdminRouter.createTheAdmin);

// update admin
router.post("/update/:id", SuperAdminRouter.updateAdmin);

// login Admin
router.post("/login", SuperAdminRouter.loginAdmin);

router.post("/forget", SuperAdminRouter.ForgetPassword);
router.post("/password-verify", SuperAdminRouter.VerifyPassword);
router.post("/password-reset", SuperAdminRouter.ResetPassword);







module.exports = router