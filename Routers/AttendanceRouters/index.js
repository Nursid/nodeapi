const AttendanceControllers = require("../../Controllers/AttendanceControllers/AttendanceController")
const express = require('express')
const router = express.Router()

router.post('/supervisor/add', AttendanceControllers.AddSupervisorAttendance)
router.post('/service-provider/add', AttendanceControllers.AddServiceProviderAttendance)
router.get('/supervisor/getall', AttendanceControllers.GetAllSupervisorAttendance)


module.exports = router
