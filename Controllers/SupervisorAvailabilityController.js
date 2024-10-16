const db = require("../model/index")
const AvailabilityModel = db.SupervisorAvailability;
const EmployeeModel = db.EmployeeModel
const moment = require('moment');

const GetAllSupervisorAvailability = async (req, res) => {
    let filterDate = req.body.date;

    try {

        if (!filterDate) {
            const date = new Date();
            const options = { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' };
            const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(date);
            filterDate = formattedDate
        }

        const providersWithAvailabilities = await EmployeeModel.findAll({
            attributes: ['name', 'image'],
            // where: { is_block: false }, // Filter on ServiceProvider
            include: [{
                model: AvailabilityModel,
                where: { date: filterDate }, // Optional: Filter on AvailabilityModel
                required: false, // This ensures a LEFT JOIN
            }]
        });
       

        // Respond with combined data
        res.status(200).json({ status: true, data: providersWithAvailabilities });

    } catch (error) {
        res.status(500).json({ error });
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
            [timeRange]: service_name
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



module.exports = {
	GetAllSupervisorAvailability, AddLeave, AssignAvailability, TransferAvailability
}
