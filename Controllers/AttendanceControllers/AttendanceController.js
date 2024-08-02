const db = require('../../model');


const SupervisorAttendance = db.SupervisorAttendance
const ServiceProviderAttendance = db.ServiceProviderAttendance

  const AddServiceProviderAttendance = async (req, res) => {
    try {
      const data = req.body

      if (data.action !== 'check_in' && data.action !== 'check_out') {
        return res.status(202).json({
          success: false,
          message: 'Invalid action. Must be either "check_in" or "check_out"'
        })
      }

      const attendanceRecord = await ServiceProviderAttendance.findOne({
        where: {
          servp_id: data.servp_id,
          in_date: new Date().toISOString().split('T')[0]
        }
      })

      let newAttendance

      if (data.action === 'check_in') {
        if (attendanceRecord && attendanceRecord.check_in) {
          return res.status(202).json({
            success: false,
            message: 'Service provider has already checked in today'
          })
        }

        newAttendance = await ServiceProviderAttendance.create({
          servp_id: data.servp_id,
          check_in: new Date().toISOString().split('T')[1].split('.')[0],
          in_date:  new Date().toISOString().split('T')[0],
          createdby: data.createdby,
          success: true,
          check_out: null,
          out_date: null
        })

      }
      
      else {
        if (attendanceRecord.check_out) {
          return res.status(202).json({
            success: false,
            message: 'Service provider has already checked out today'
          })
        }
        newAttendance = await ServiceProviderAttendance.update({
          check_out: new Date().toISOString().split('T')[1].split('.')[0],
          out_date: new Date().toISOString().split('T')[0],
          success: false,
        }, {
          where: {
            servp_id: data.servp_id,
            check_in: attendanceRecord.check_in,
            in_date: attendanceRecord.in_date
          }
        })
      }

      res.status(200).json({
        success: true,
        message: `Service provider ${data.action === 'check_in' ? 'checked in' : 'checked out'} successfully`,
        data: newAttendance
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error managing service provider attendance',
        error: error.message
      })
    }
  }

  const AddSupervisorAttendance = async (req, res) => {
    try {
      const data = req.body

      if (data.action !== 'check_in' && data.action !== 'check_out') {
        return res.status(202).json({
          success: false,
          message: 'Invalid action. Must be either "check_in" or "check_out"'
        })
      }

      const attendanceRecord = await SupervisorAttendance.findOne({
        where: {
          emp_id: data.emp_id,
          in_date: new Date().toISOString().split('T')[0]
        }
      })

      let newAttendance

      if (data.action === 'check_in') {
        if (attendanceRecord && attendanceRecord.check_in) {
          return res.status(202).json({
            success: false,
            message: 'Supervisor has already checked in today'
          })
        }

        newAttendance = await SupervisorAttendance.create({
          emp_id: data.emp_id,
          check_in: new Date().toISOString().split('T')[1].split('.')[0],
          in_date: new Date().toISOString().split('T')[0],
          createdby: data.createdby,
          status: true,
          check_out: null,
          out_date: null
        })
      }
      else {
        if (attendanceRecord.check_out) {
          return res.status(202).json({
            success: false,
            message: 'Supervisor has already checked out today'
          })
        }
        newAttendance = await SupervisorAttendance.update({
          check_out: new Date().toISOString().split('T')[1].split('.')[0],
          out_date: new Date().toISOString().split('T')[0],
          status: false
        }, {
          where: {
            emp_id: data.emp_id,
            check_in: attendanceRecord.check_in,
            in_date: attendanceRecord.in_date
          }
        })
      }
      res.status(200).json({
        success: true,
        message: `Supervisor ${data.action === 'check_in' ? 'checked in' : 'checked out'} successfully`,
        data: newAttendance
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error managing supervisor attendance',
        error: error.message
      })
    }
  }

const GetAllSupervisorAttendance = async (req, res) => {
  try {
    const allAttendance = await SupervisorAttendance.findAll()
    
    res.status(200).json({
      success: true,
      message: 'All attendance records retrieved successfully',
      data: allAttendance
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance records',
      error: error.message
    })
  }
}

module.exports = { AddSupervisorAttendance, AddServiceProviderAttendance, GetAllSupervisorAttendance }