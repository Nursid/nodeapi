const express = require('express');
const router = express.Router();

const MemberController=require("../../Controllers/CustomerControllers/MemberControllers")

router.get("/getall",MemberController.GetMember);
module.exports = router;