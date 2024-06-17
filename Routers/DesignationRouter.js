const express = require('express');
const router = express.Router();

const GetAllDesignation=require("../Controllers/DesignationController")

router.get("/getall",GetAllDesignation.GetAllDesignation);
module.exports = router;