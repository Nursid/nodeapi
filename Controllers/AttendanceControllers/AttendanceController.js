const db = require('../../model');
const SupervisorAttendance = db.SupervisorAttendance
const ServiceProviderAttendance = db.ServiceProviderAttendance

const AddServiceProviderAttendance = async (req, res) => {
  try {
    const data = req.body

    let date = new Date();

    // Convert the date to Kolkata time zone (IST) with milliseconds
    let kolkataTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false });
    let milliseconds = date.getMilliseconds();

    // Format the time with milliseconds
    let formattedTime = kolkataTime.split(', ')[1] + `.${milliseconds}`;

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
        check_in: formattedTime,
        in_date:  new Date().toISOString().split('T')[0],
        createdby: data.createdby,
        status: 'Working',
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
        check_out: formattedTime,
        out_date: new Date().toISOString().split('T')[0],
        status: 'Present',
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

    let date = new Date();

  // Convert the date to Kolkata time zone (IST) with milliseconds
  let kolkataTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false });
  let milliseconds = date.getMilliseconds();

  // Format the time with milliseconds
  let formattedTime = kolkataTime.split(', ')[1] + `.${milliseconds}`;


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
        check_in: formattedTime,
        in_date: new Date().toISOString().split('T')[0],
        createdby: data.createdby,
        status: 'Working',
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
        check_out: formattedTime,
        out_date: new Date().toISOString().split('T')[0],
        status: 'Present'
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
    const allAttendance = await SupervisorAttendance.findAll({
      where:{
        in_date: new Date().toISOString().split('T')[0]
      }
    })
    
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

const GetAllServiceProviderAttendance = async (req, res) => {
  try {
    const allAttendance = await ServiceProviderAttendance.findAll({
      where:{
        in_date: new Date().toISOString().split('T')[0]
      }
    })
    
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


const AddLeaveSupervisor = async (req, res) => {
  const data = req.body;

  try {
    const { emp_id, in_date, message, status, createdby } = data;

    // Check if an entry already exists with the same emp_id and in_date
    const existingEntry = await SupervisorAttendance.findOne({
      where: {
        emp_id,
        in_date
      }
    });

    if (existingEntry) {
      // Update the existing entry
      await existingEntry.update({
        message,
        status,
        createdby,
        out_date: null,
        check_in: null,
        check_out: null
      });
      return res.status(200).json({ status: 200, message: 'Record updated successfully' });
    } else {
      // Create a new entry
      const newEntry = await SupervisorAttendance.create({
        emp_id,
        in_date,
        message,
        status,
        createdby,
      });
      return res.status(200).json({ status: 200,  message: 'Record created successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};


const AddLeaveServiceProvider = async (req, res) => {
  const data = req.body;

  try {
    const { servp_id, in_date, message, status, createdby } = data;

    // Check if an entry already exists with the same emp_id and in_date
    const existingEntry = await ServiceProviderAttendance.findOne({
      where: {
        servp_id,
        in_date
      }
    });

    if (existingEntry) {
      // Update the existing entry
      await existingEntry.update({
        message,
        status,
        createdby,
        out_date: null,
        check_in: null,
        check_out: null
      });
      return res.status(200).json({ status: 200, message: 'Record updated successfully' });
    } else {
      // Create a new entry
      const newEntry = await ServiceProviderAttendance.create({
        servp_id,
        in_date,
        message,
        status,
        createdby,
      });
      return res.status(200).json({ status: 200,  message: 'Record created successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

module.exports = { AddSupervisorAttendance, AddServiceProviderAttendance, GetAllSupervisorAttendance, GetAllServiceProviderAttendance, AddLeaveSupervisor, AddLeaveServiceProvider }