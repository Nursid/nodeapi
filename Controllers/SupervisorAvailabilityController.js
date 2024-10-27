const db = require("../model/index")
const AvailabilityModel = db.SupervisorAvailability;
const EmployeeModel = db.EmployeeModel
const moment = require('moment');
const { Op } = require('sequelize');

var AllLeaveSlots = {
    '07:00-07:30': 'p',
    '07:30-08:00': 'p',
    '08:00-08:30': 'p',
    '08:30-09:00': 'p',
    '09:00-09:30': 'p',
    '09:30-10:00': 'p',
    '10:00-10:30': 'p',
    '10:30-11:00': 'p',
    '11:00-11:30': 'p',
    '11:30-12:00': 'p',
    '12:00-12:30': 'p',
    '12:30-01:00': 'p',
    '01:00-01:30': 'p',
    '01:30-02:00': 'p',
    '02:00-02:30': 'p',
    '02:30-03:00': 'p',
    '03:00-03:30': 'p',
    '03:30-04:00': 'p',
    '04:00-04:30': 'p',
    '04:30-05:00': 'p',
    '05:00-05:30': 'p',
    '05:30-06:00': 'p',
}

const GetAllSupervisorAvailability = async (req, res) => {
    const { date: filterDate, from, to, emp_id } = req.body;

    try {
        let whereConditions = {}; 
        let where = {}; 
        
        // If emp_id exists, add it to the conditions
        if (emp_id) {
            where.emp_id = emp_id;
            whereConditions.emp_id = emp_id;
        }

        // If both from and to exist, we'll filter on date range
        if (from && to) {
            // Ensure the dates are in the correct format
            const startDate = new Date(from).toISOString().split('T')[0];
            const endDate = new Date(to).toISOString().split('T')[0];
            whereConditions.date = {
                [Op.between]: [startDate, endDate]
            };
        } else if (filterDate) {
            // If only a date is present, filter by that date
            const today = new Date();
            const formattedDate = filterDate || today.toISOString().split('T')[0];
            whereConditions.date = formattedDate;
        }

        const providersWithAvailabilities = await EmployeeModel.findAll({
            attributes: ['name', 'image', 'duty_hours', 'week_off'],
                include: [{
                model: AvailabilityModel,
                required: false, // This ensures a LEFT JOIN
                where: whereConditions,
            }],
            where: where
        });

        // Check if combinedData is empty
        if (providersWithAvailabilities.length === 0) {
            return res.status(200).json({ status: false, message: "No availability found!" });
        }

        // Respond with combined data
        res.status(200).json({ status: true, data: providersWithAvailabilities });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const AddLeave = async (req, res) => {
    const data = req.body;
    const empId = String(data.emp_id);
    try {
       
        const existingLeave = await AvailabilityModel.findOne({
           where:{ 
            date: data?.date,
            emp_id: empId
           }
        });
        // Define leave slots based on the leave type
        let leaveSlots = {};

        if (data.leaveDay === '1' || data.leaveDay === '3' || data.leaveDay === '4' ) {
            // Full Day Leave: Add leave for all time slots
            leaveSlots = {
                '07:00-07:30': data?.label,
                '07:30-08:00': data?.label,
                '08:00-08:30': data?.label,
                '08:30-09:00': data?.label,
                '09:00-09:30': data?.label,
                '09:30-10:00': data?.label,
                '10:00-10:30': data?.label,
                '10:30-11:00': data?.label,
                '11:00-11:30': data?.label,
                '11:30-12:00': data?.label,
                '12:00-12:30': data?.label,
                '12:30-01:00': data?.label,
                '01:00-01:30': data?.label,
                '01:30-02:00': data?.label,
                '02:00-02:30': data?.label,
                '02:30-03:00': data?.label,
                '03:00-03:30': data?.label,
                '03:30-04:00': data?.label,
                '04:00-04:30': data?.label,
                '04:30-05:00': data?.label,
                '05:00-05:30': data?.label,
                '05:30-06:00': data?.label,
            };
        } else if (data.leaveDay === '2') {
            if (data.half === '1') {
                // First Half Day Leave: Add leave for the morning slots
                leaveSlots = {
                    '07:00-07:30': data?.label,
                    '07:30-08:00': data?.label,
                    '08:00-08:30': data?.label,
                    '08:30-09:00': data?.label,
                    '09:00-09:30': data?.label,
                    '09:30-10:00': data?.label,
                    '10:00-10:30': data?.label,
                    '10:30-11:00': data?.label,
                    '11:00-11:30': data?.label,
                    '11:30-12:00': data?.label,
                    '12:00-12:30': data?.label,
                    '12:30-01:00': data?.label,
                    '01:00-01:30': data?.label,
                };
            } else if (data.half === '2') {
                // Second Half Day Leave: Add leave for the afternoon slots
                leaveSlots = {
                    '01:30-02:00': data?.label,
                    '02:00-02:30': data?.label,
                    '02:30-03:00': data?.label,
                    '03:00-03:30': data?.label,
                    '03:30-04:00': data?.label,
                    '04:00-04:30': data?.label,
                    '04:30-05:00': data?.label,
                    '05:00-05:30': data?.label,
                    '05:30-06:00': data?.label,
                };
            }
        }

        let isLeave;
        // Check for already assigned slots
        if (existingLeave) {
            // Update existing leave record
            await AvailabilityModel.update(
                leaveSlots,
                {
                    where: {
                        date: data.date,
                        emp_id: empId
                    },
                }
            )
        } else {
            // Create a new leave record
            isLeave = await AvailabilityModel.create({
                date: data.date,
                emp_id: data.emp_id,
                ...leaveSlots
            });
        }

        return res.status(200).json({
            message: data.leaveDay === '1' ? 'Leave added successfully for the full day' : 'Leave added successfully for the half day',
            data: isLeave
        });

    } catch (error) {
        return res.status(202).json({ message: "Internal Error", error: error.message });
    }
};


const AssignAvailability = async(req, res) =>{
    const mobile_no = req.params.mobile_no;
    const data = req.body;
    const date=req.params.date

try {
    const isEmployee = await AvailabilityModel.findOne({
        where: {
            emp_id: mobile_no,
            date:date
        }
    });

    if (!isEmployee) {
        return res.status(202).json({ status: false, message: "Employee Not Found" });
    }

    await AvailabilityModel.update(data, {
        where: {
            emp_id: mobile_no,
            date: date
        }
    });

    res.status(200).json({ status: true, message: "Employee Assigned Successfully" });
} catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ status: false, message: "An error occurred while updating the employee." });
}
}


const AddAttendance = async (req, res) => { 
 
    const empId = String(req.params.empId); 
    try {

        let date = new Date();

        // Convert the date to Kolkata time zone (IST) without milliseconds
        let kolkataTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false });

        // Extract the hours and minutes
        let timeParts = kolkataTime.split(', ')[1].split(':');
        let hours = parseInt(timeParts[0]);
        let minutes = parseInt(timeParts[1]);


        // Check if the time is between 6:00 PM and 6:00 AM
        let isAfterSixPM = (hours >= 18); // 6 PM is 18 in 24-hour format
        let isBeforeSixAM = (hours < 6); // 6 AM is less than 6 in 24-hour format

        if (isAfterSixPM || isBeforeSixAM) {
            return  res.status(200).json({status: false, Message: "Invailid Time To Check" });
        } else {
            // Convert to 12-hour format
        
            
            // Convert to 12-hour format
            let period = hours >= 12 ? 'PM' : 'AM';
            let formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
            
            // Format the final output
            let formattedTime = `${formattedHours}:${minutes}`;
            

            const options = { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' };
            const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(date);
        

            let leaveSlots = filterLeaveSlots(formattedTime)

            const existingRecords = await AvailabilityModel.findAll({
                where: { date: formattedDate,
                   emp_id: empId 
                 },
                raw: true, // Get plain JavaScript objects instead of Sequelize instances
            });
            if(existingRecords.length > 0){
                const existingSlots = existingRecords.reduce((acc, record) => {
                    for (const [slot, status] of Object.entries(record)) {
                        if (status !== null) {
                            acc[slot] = true; // Mark this slot as filled
                        }
                    }
                    return acc;
                }, {});
                
                const slotsToInsert = {};
                
                for (const [slot, status] of Object.entries(leaveSlots)) {
                    if (!existingSlots[slot]) {
                        slotsToInsert[slot] = status; // Only include slots that are not already filled
                    }
                }
                
                if (Object.keys(slotsToInsert).length > 0) {
                    const isAttendance = await AvailabilityModel.update({...slotsToInsert},
                        {
                            where: {
                                date: formattedDate,
                                emp_id: empId,
                            },
                        }
                 );
                }
    
            }else{
                const isAttendance = await AvailabilityModel.create({
                    date: formattedDate,
                    emp_id: empId,
                    ...leaveSlots
                });
            }
            
            
            return  res.status(200).json({status: true, message: "Availability Added Successfully!"});
    }

    } catch (error) {
        return res.status(202).json({ message: "Internal Error", error: error.message });
    }
};


const TransferAvailability = async(req, res) =>{
   
    const { fromEmpId, fromDate, toEmpId, toDate, timeRange, service_name, totimeRange } = req.body;

    if (!fromEmpId || !fromDate || !toEmpId || !toDate || !timeRange) {
      return res.status(202).json({ message: 'fromEmpId, fromDate, toEmpId, toDate, and timeRange are required' });
    }
  
    try {
      // Step 1: Fetch the specific time slot value for the fromEmpId and fromDate
      const recordToTransfer = await AvailabilityModel.findOne({
        where: {
          emp_id: fromEmpId,
          date: fromDate,
          [timeRange]: service_name
        }
      });

  
      if (!recordToTransfer) {
        return res.status(202).json({ status: false, message: "No availability found"});
      }

      const isAvailability = await AvailabilityModel.findOne({
        where:{
            emp_id: toEmpId,
            date: toDate,
            [totimeRange]: service_name
        }
      })
      if(isAvailability){
        return res.status(202).json({ status: false, message: "Already Assign another service"})
      }

      const IsAvailableTransferDate = await AvailabilityModel.findOne({
        where: {
            emp_id: toEmpId,
            date: toDate,
        }
      })


      const updateData = {
        [totimeRange]: service_name
      }

      if(IsAvailableTransferDate){
       const istransfer = await AvailabilityModel.update(updateData,{
            where:{
                emp_id: toEmpId,
                date: toDate,
            }
          })

          await AvailabilityModel.update( {[timeRange]: null},{
            where:{
                emp_id: fromEmpId,
                date: fromDate,
            }
          })

          return res.status(200).json({ status: true, message: "Availability Transferred Successfully" });
       } else{
        const istransfer = await AvailabilityModel.create({
            emp_id: toEmpId,
            date: toDate,
            [totimeRange]: service_name,
          })

          await AvailabilityModel.update({[timeRange]: null},{
            where:{
                emp_id: fromEmpId,
                date: fromDate,
            }
          })
          return res.status(200).json({ status: true, message: "Availability Transferred Successfully" });
      }
    } catch (error) {
      console.error('Error transferring availability:', error);
      res.status(500).json({ message: 'An error occurred while transferring availability records' });
    }x
}


function filterLeaveSlots(time) {
    const result = {};
    
    // Convert the input time to minutes
    const inputHours = parseInt(time.split(':')[0]);
    const inputMinutes = parseInt(time.split(':')[1]);
    const inputTotalMinutes = inputHours * 60 + inputMinutes;

    // Iterate through the leave slots
    for (const slot in AllLeaveSlots) {
        const [start, end] = slot.split('-');
        
        // Convert start and end times to minutes
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);
        
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;

        // Check if the input time is within the slot's time range
        if (inputTotalMinutes >= startTotalMinutes && inputTotalMinutes < endTotalMinutes) {
            result[slot] = AllLeaveSlots[slot];
        }
    }

    // Return all slots from the matched one onward
    const finalResult = {};
    let found = false;
    for (const slot in AllLeaveSlots) {
        if (found || slot in result) {
            finalResult[slot] = AllLeaveSlots[slot];
            found = true;
        }
    }

    return finalResult;
}


module.exports = {
	GetAllSupervisorAvailability, AddLeave, AssignAvailability, TransferAvailability, AddAttendance
}
