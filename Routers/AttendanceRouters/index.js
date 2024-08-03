const AttendanceControllers = require("../../Controllers/AttendanceControllers/AttendanceController")
const express = require('express')
const router = express.Router()

router.post('/supervisor/add', AttendanceControllers.AddSupervisorAttendance)
router.get('/supervisor/getall', AttendanceControllers.GetAllSupervisorAttendance)

router.post('/service-provider/add', AttendanceControllers.AddServiceProviderAttendance)
router.get('/service-provider/getall', AttendanceControllers.GetAllServiceProviderAttendance)

module.exports = router
