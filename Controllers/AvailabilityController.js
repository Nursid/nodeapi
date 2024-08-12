const db = require("../model/index")
const AvailabilityModel = db.Availability;
const EmployeeModel = db.EmployeeModel
const ServiceProvider = db.ServiceProviderModel
const moment = require('moment');

const GetAllAvailability = async (req, res) => {
    const filterDate = req.body.date;

    try {
        if (!filterDate) {
            const today = new Date();
            // Format the date to match the format used in your database (e.g., 'YYYY-MM-DD')
            filterDate = today.toISOString().split('T')[0];
        }
        // Fetch availabilities and employees in parallel
        // const [availabilities, employees] = await Promise.all([
        //     AvailabilityModel.findAll({
        //         where: { date: filterDate }
        //     }),
        //     ServiceProvider.findAll({
        //         attributes: ['id', 'name', 'provider_type'],
        //         where: { block_id: true }
        //     })
        // ]);

        const availabilities = await AvailabilityModel.findAll({
            where: { date: filterDate }
        })
        const employees = await ServiceProvider.findAll({
            attributes: ['id', 'name', 'provider_type'],
            where: { block_id: true }
        })

        // Combine data
        // const combinedData = employees.map(employee => {
        //     const matchingAvailability = availabilities.find(
        //         available => parseInt(available.emp_id, 10) === parseInt(employee.id, 10)
        //     );

        //     return matchingAvailability
        //         ? { id: employee.id, name: employee.name, ...matchingAvailability.dataValues, provider_type: employee.provider_type, "01:00-01:30": 'Lunch' }
        //         : { id: employee.id, name: employee.name, provider_type: employee.provider_type, "01:00-01:30": 'Lunch'  };
        // });

        const combinedData = employees.map((employee) => {
            const matchingAttendance = availabilities.find(available => 
                parseInt(available.emp_id, 10) === parseInt(employee.id, 10)
              );
        
            if (matchingAttendance) {
                return { id: employee.id, name: employee.name, ...matchingAttendance.dataValues, provider_type: employee.provider_type, "01:00-01:30": 'Lunch'  };
            } else {
                return { id: employee.id, name: employee.name, provider_type: employee.provider_type, "01:00-01:30": 'Lunch'  };
            }
        });

        // Check if combinedData is empty
        if (combinedData.length === 0) {
            return res.status(200).json({ status: false, message: "User Not Found!" });
        }

        // Respond with combined data
        res.status(200).json({ status: true, data: combinedData });

    } catch (error) {
        res.status(500).json({ error });
    }
};


const AddAvailability = async (req, res) => {

try{

    const data= req.body;

    const addEmployee = await Promise.all(
        data.employees.map(async (emp_id) => {

            const IsEmployee = await AvailabilityModel.findOne({where:{
                date: data.date,
                emp_id: emp_id
            }})
            if(!IsEmployee){
                return AvailabilityModel.create({
                    emp_id: emp_id,  // Directly use the string
                    date: data.date
                });
            }
        })
    );
    const successfullyAddedEmployees = addEmployee.filter(emp => emp !== undefined);

    if (successfullyAddedEmployees.length === 0) {
        return res.status(200).json({ status: false , message: "All employees already Exist on given date." });
    } else {
        return res.status(200).json({status: true, message: "Employees successfully added!.", });
    }
}catch(error){
    res.status(500).json(" Internal Error "+error)
}}

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
        return res.status(404).json({ status: false, message: "Employee Not Found" });
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





module.exports = {
	GetAllAvailability,AddAvailability, AssignAvailability
}
