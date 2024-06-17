const router = require("express").Router();
const sendOtp = require("./../Controllers/verifyControllers");

// send otp on mobile  Number
router.get("/send/otp/:number", sendOtp);

module.exports = router;
