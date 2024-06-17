const db = require("../model/index")
const AvailabilityModel = db.Availability;
const EmployeeModel = db.EmployeeModel
const moment = require('moment');

const GetAllAvailability = async (req, res) => {
        const filterDate =  req.body.date;

       try {
            const availabilities = await AvailabilityModel.findAll({
                where:{
                    date:filterDate
                },
                order: [
                    ['id', 'DESC']
                ]
            });

        const AllAvailability = await Promise.all(availabilities.map(async (item) => {
            const Employee = await EmployeeModel.findOne({
                attributes: ['name'],
                where: {
                    mobile_no: item.emp_id
                }
            });
        
            return {
                ...item.dataValues,
                Employee: Employee ? Employee.dataValues : null
            };
        }));

		if (!AllAvailability) {
			res.status(200).json({status: false, message: "User Not Found!"})
		}

		res.status(200).json({status: true, data: AllAvailability})

	} catch (error) {
		res.status(500).json({error})
	}
}

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
