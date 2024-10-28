const AttendanceControllers = require("../../Controllers/AttendanceControllers/AttendanceController")
const express = require('express')
const router = express.Router()

router.post('/supervisor/add', AttendanceControllers.AddSupervisorAttendance)
router.get('/supervisor/getall', AttendanceControllers.GetAllSupervisorAttendance)
router.post('/supervisor/report', AttendanceControllers.GetAllSupervisorAttendanceReport)

router.post('/service-provider/add', AttendanceControllers.AddServiceProviderAttendance)
router.get('/service-provider/getall', AttendanceControllers.GetAllServiceProviderAttendance)
router.post('/service-provider/report', AttendanceControllers.GetAllServiceProvderAttendanceReport)


router.post('/supervisor/leave', AttendanceControllers.AddLeaveSupervisor)
router.post('/service-provider/leave', AttendanceControllers.AddLeaveServiceProvider)

module.exports = router
