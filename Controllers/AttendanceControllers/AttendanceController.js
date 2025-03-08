const db = require('../../model');
const SupervisorAttendance = db.SupervisorAttendance
const ServiceProviderAttendance = db.ServiceProviderAttendance
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
const { Op } = require('sequelize');
const DesignationModel = db.DesignationModel
const sequelize = require('../../config/sequalize');
const SupervisorAvailability = db.SupervisorAvailability
const AvailabilityModel= db.Availability


const AddServiceProviderAttendance = async (req, res) => {
  try {
    const data = req.body

    let date = new Date();

    // Convert the date to Kolkata time zone (IST) with milliseconds
    let kolkataTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false });
    let milliseconds = date.getMilliseconds();

    // Format the time with milliseconds
    let formattedTime = kolkataTime.split(', ')[1] + `.${milliseconds}`;

    const options = { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(date);

    if (data.action !== 'check_in' && data.action !== 'check_out') {
      return res.status(202).json({
        success: false,
        message: 'Invalid action. Must be either "check_in" or "check_out"'
      })
    }

    const attendanceRecord = await ServiceProviderAttendance.findOne({
      where: {
        servp_id: data.servp_id,
        in_date: formattedDate
      }
    })

    let newAttendance

    if (data.action === 'check_in') {

      let date = new Date();

      // Convert the date to Kolkata time zone (IST) without milliseconds
      let kolkataTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false });

      // Extract the hours and minutes
      let timeParts = kolkataTime.split(', ')[1].split(':');
      let hours = parseInt(timeParts[0]);
      let minutes = parseInt(timeParts[1]);     
      // let hours = 7
      // let minutes = 40 

      // Check if the time is between 6:00 PM and 6:00 AM
      let isAfterSixPM = (hours >= 18); // 6 PM is 18 in 24-hour format
      let isBeforeSixAM = (hours < 6); // 6 AM is less than 6 in 24-hour format

      if (isAfterSixPM || isBeforeSixAM) {
          return  res.status(202).json({status: false, message: "Invailid Time To Check In" });
      }

      if (attendanceRecord && attendanceRecord.check_in) {
        return res.status(202).json({
          success: false,
          message: 'Service provider has already checked in today'
        })
      }
      

      newAttendance = await ServiceProviderAttendance.create({
        servp_id: data.servp_id,
        check_in: formattedTime,
        in_date:  formattedDate,
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
        out_date: formattedDate,
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
    const options = { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(date);

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
        in_date: formattedDate
      }
    })

    let newAttendance

    if (data.action === 'check_in') {

      let date = new Date();

      // Convert the date to Kolkata time zone (IST) without milliseconds
      let kolkataTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false });

      // Extract the hours and minutes
      let timeParts = kolkataTime.split(', ')[1].split(':');
      let hours = parseInt(timeParts[0]);
      let minutes = parseInt(timeParts[1]);

      // let hours = 7
      // let minutes = 40
  
      // Check if the time is between 6:00 PM and 6:00 AM
      let isAfterSixPM = (hours >= 18); // 6 PM is 18 in 24-hour format
      let isBeforeSixAM = (hours < 6); // 6 AM is less than 6 in 24-hour format

      if (isAfterSixPM || isBeforeSixAM) {
          return  res.status(202).json({status: false, message: "Invailid Time To Check In" });
      }

      if (attendanceRecord && attendanceRecord.check_in) {
        return res.status(202).json({
          success: false,
          message: 'Supervisor has already checked in today'
        })
      }

      newAttendance = await SupervisorAttendance.create({
        emp_id: data.emp_id,
        check_in: formattedTime,
        in_date: formattedDate,
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
        out_date: formattedDate,
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

    const date = new Date();
    const options = { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(date);

    const allAttendance = await SupervisorAttendance.findAll({
      where:{
        in_date: formattedDate
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

    const date = new Date();
const options = { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' };
const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(date);

    const allAttendance = await ServiceProviderAttendance.findAll({
      where:{
        in_date: formattedDate
      }
    })
    
    res.status(200).json({
      success: true,
      message: 'All attendance records retrieved successfully',
      data: allAttendance,
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


const GetAllSupervisorAttendanceReport = async (req, res) => {
  const { from, to, supervisor} = req.body;

  try {
    let dateCondition;

    if (from && to) {
      // Convert and validate provided dates
      const startDate = new Date(from);
      const endDate = new Date(to);

      dateCondition = {
        in_date: {
          [Op.between]: [startDate, endDate]
        },
        emp_id: supervisor
      };
    } else {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
      dateCondition = {
        in_date: {
          [Op.between]: [currentMonthStart, currentMonthEnd]
        }
      };
    }

    // Fetch attendance records based on the date condition
    const allAttendance = await SupervisorAttendance.findAll({
      include: [{
        model: EmployeeModel,
      }],
      order: [['id', 'DESC']],
      where: dateCondition
    });

    res.status(200).json({
      success: true,
      message: 'All attendance records retrieved successfully',
      data: allAttendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance records',
      error: error.message
    });
  }
};




const GetAllServiceProvderAttendanceReport = async (req, res) => {
  const { from, to, emp_id} = req.body;

  try {
    let dateCondition;

    if (from && to) {
      // Convert and validate provided dates
      const startDate = new Date(from);
      const endDate = new Date(to);

      dateCondition = {
        in_date: {
          [Op.between]: [startDate, endDate]
        },
        servp_id: emp_id
      };
    } else {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
      dateCondition = {
        in_date: {
          [Op.between]: [currentMonthStart, currentMonthEnd]
        }
      };
    }

    // Fetch attendance records based on the date condition
    const allAttendance = await ServiceProviderAttendance.findAll({
      include: [{
        model: ServiceProviderModel,
      }],
      order: [['id', 'DESC']],
      where: dateCondition
    });

    // const allAttendance = await  ServiceProviderModel.findAll({
    //   include: [{
    //     model: ServiceProviderAttendance,
    //     where: dateCondition,
    //     order: [['id', 'DESC']],
    //   }],
    // });


    res.status(200).json({
      success: true,
      message: 'All attendance records retrieved successfully',
      data: allAttendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance records',
      error: error.message
    });
  }
};



const GetAllAttendanceReport = async (req, res) => {
  const  data = req.body; // Optional specific date for filtering
  try {
    let dateCondition;

    if (data && data.date) {
      const specificDate = new Date(data.date);
      dateCondition = {
        in_date: {
          [Op.eq]: specificDate
        }
      };
    }else {
      const now = new Date();
      dateCondition = {
        in_date: {
          [Op.eq]: now
        }
      };
    }

    // Fetch attendance for both supervisors and service providers
    const [supervisorAttendance, serviceProviderAttendance] = await Promise.all([
      SupervisorAttendance.findAll({
        include: [{ model: EmployeeModel,
          attributes:  ["name","mobile_no", "designation_id", "start_time"],
         include: [{
            model: DesignationModel,
            attributes: ['name', "id"]
          }],
         }],
        attributes:  ["check_in", "check_out","status" , "in_date"] ,
        order: [["id", "DESC"]],
        where: dateCondition
      }),
      ServiceProviderAttendance.findAll({
        include: [{ model: ServiceProviderModel ,
          attributes:  ["name","mobile_no", "start_time"  ],
        }],
        order: [["id", "DESC"]],
        attributes:  ["check_in", "check_out", "status" , "in_date"] ,
        where: dateCondition
      })
    ]);

    const supervisorAttendanceData = supervisorAttendance.map((record) => ({
      check_in: record.check_in,
      check_out: record.check_out,
      status: record.status,
      in_date: record.in_date,
      name: record?.employee?.name,
      mobile_no: record?.employee?.mobile_no,
      role: record?.employee?.designation?.name,
      start_time: record?.employee?.start_time 
    }));
  
    // Map service providers data to the same structure
    const serviceProviderAttendanceData = serviceProviderAttendance.map((record) => ({
      check_in: record.check_in,
      check_out: record.check_out,
      status: record.status,
      in_date: record.in_date,
      name: record?.service_provider?.name,
      mobile_no: record?.service_provider?.mobile_no,
      role: "Service Provider", // Add a role for service providers,
      start_time: record?.service_provider?.start_time 
    }));
    const mergedData = [...supervisorAttendanceData, ...serviceProviderAttendanceData];
    
  

    // Respond with the combined data
    res.status(200).json({
      success: true,
      message: "Attendance records retrieved successfully",
      data: mergedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving attendance records",
      error: error.message
    });
  }
};


const SupervisorAttendanceReset = async (req, res) => {
  const data = req.body;

  try {
    const { emp_id, in_date } = data;

    // Validate required fields
    if (!emp_id || !in_date) {
      return res.status(400).json({ 
        status: 400, 
        message: 'emp_id and in_date are required fields.' 
      });
    }

    // Start transaction
    const transaction = await sequelize.transaction();

      // 1. Reset Supervisor Attendance
      await SupervisorAttendance.update(
        {
          message: null,
          status: null,
          createdby: null,
          out_date: null,
          check_in: null,
          check_out: null,
          in_date: null
        },
        {
          where: { emp_id: emp_id, in_date: in_date },
          transaction
        }
      );
      

      // 2. Reset Supervisor Availability
      const leaveSlots = {
        '07:00-07:30': null,
        '07:30-08:00': null,
        '08:00-08:30': null,
        '08:30-09:00': null,
        '09:00-09:30': null,
        '09:30-10:00': null,
        '10:00-10:30': null,
        '10:30-11:00': null,
        '11:00-11:30': null,
        '11:30-12:00': null,
        '12:00-12:30': null,
        '12:30-01:00': null,
        '01:00-01:30': null,
        '01:30-02:00': null,
        '02:00-02:30': null,
        '02:30-03:00': null,
        '03:00-03:30': null,
        '03:30-04:00': null,
        '04:00-04:30': null,
        '04:30-05:00': null,
        '05:00-05:30': null,
        '05:30-06:00': null,
      };

      // Use upsert to handle both update and create scenarios

      await SupervisorAvailability.update(
        leaveSlots,
        {
            where: {
                date: in_date,
                emp_id: emp_id
            },
        }
      )

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({ 
        status: 200, 
        message: 'Attendance and availability records reset successfully.' ,
        data
      });
  } catch (error) {
    console.error('Reset Error:', error);
    return res.status(500).json({ 
      status: 500, 
      message: 'Internal server error during reset operation.',
      // Only expose error details in development
    });
  }
};

const ServiceProviderAttendanceReset = async (req, res) => {
  const data = req.body;

  try {
    const { emp_id, in_date } = data;
    const empId = emp_id;

    // Validate required fields
    if (!empId || !in_date) {
      return res.status(400).json({ 
        status: 400, 
        message: 'emp_id and in_date are required fields.' 
      });
    } 

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // 1. Reset Supervisor Attendance
      await ServiceProviderAttendance.update(
        {
          message: null,
          status: null,
          createdby: null,
          out_date: null,
          check_in: null,
          check_out: null,
          in_date: null
        },
        {
          where: { servp_id: empId, in_date: in_date },
          transaction
        }
      );

      // 2. Reset Supervisor Availability
      const leaveSlots = {
        '07:00-07:30': null,
        '07:30-08:00': null,
        '08:00-08:30': null,
        '08:30-09:00': null,
        '09:00-09:30': null,
        '09:30-10:00': null,
        '10:00-10:30': null,
        '10:30-11:00': null,
        '11:00-11:30': null,
        '11:30-12:00': null,
        '12:00-12:30': null,
        '12:30-01:00': null,
        '01:00-01:30': null,
        '01:30-02:00': null,
        '02:00-02:30': null,
        '02:30-03:00': null,
        '03:00-03:30': null,
        '03:30-04:00': null,
        '04:00-04:30': null,
        '04:30-05:00': null,
        '05:00-05:30': null,
        '05:30-06:00': null,
      };

      // Use upsert to handle both update and create scenarios
      await AvailabilityModel.update(
        leaveSlots,
        {
            where: {
                date: in_date,
                emp_id: empId
            },
        }
      )

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({ 
        status: 200, 
        message: 'Attendance and availability records reset successfully.' 
      });
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error; // Throw to outer catch
    }
  } catch (error) {
    console.error('Reset Error:', error);
    return res.status(500).json({ 
      status: 500, 
      message: 'Internal server error during reset operation.',
      // Only expose error details in development
    });
  }
};


module.exports = { AddSupervisorAttendance, AddServiceProviderAttendance, GetAllSupervisorAttendance, GetAllServiceProviderAttendance, AddLeaveSupervisor, AddLeaveServiceProvider, GetAllSupervisorAttendanceReport,GetAllServiceProvderAttendanceReport, GetAllAttendanceReport,
  ServiceProviderAttendanceReset, SupervisorAttendanceReset
 }