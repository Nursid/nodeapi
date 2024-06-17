const express = require('express');
const router = express.Router();

const GetAllDepartments=require("../Controllers/DepartmentController")

router.get("/getall",GetAllDepartments.GetAllDepartments);
module.exports = router;