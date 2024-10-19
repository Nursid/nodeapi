require("dotenv").config();
const db = require("../../model/index");
const EmployeeModel = db.EmployeeModel;
const DepartmentModel = db.DepartmentsModel
const DesignationModel = db.DesignationModel
const Empservices = db.Empservices
const ServiceProviderModel = db.ServiceProviderModel
const NewCustomerModel = db.NewCustomerModel
const jwt = require("jsonwebtoken");
const {isEmail, isMobileNumber, isOptValid} = require("../utils");
const SupervisorAvailability = db.SupervisorAvailability;

// Add the Service Provider
const AddEmployee = async (req, res) => {
	
	try {
		const data = req.body;

		const empServiceData = JSON.parse(data?.multiServices);

		if(req.files){
		const {pan_image, adhar_image, image} = req.files;
		data.pan_image = pan_image ? pan_image[0].filename : null;
		data.adhar_image = adhar_image ? adhar_image[0].filename : null;
		data.image = image ? image[0].filename : null;
		}
		
		// Check if user with the provided mobile number already exists
		const isUser = await EmployeeModel.findOne({
			where: {
				mobile_no: data.mobile_no
			}
		});

		if (isUser) {
			return res.status(202).json({status: 202, message: "Employee Already Registered with this Mobile No."});
		}

		const isServiceProvider = await ServiceProviderModel.findOne({
			where:{
				mobile_no: data.mobile_no
			}
		});

		if (isServiceProvider) {
			return res.status(200).json({status:false, message: 'Mobile No. Already Exists in Service Provider!'});
		}

		const isCustomer = await NewCustomerModel.findOne({
			where:{
				mobileno: data.mobile_no
			}
		});

		if (isCustomer) {
			return res.status(200).json({status:false, message: 'Mobile No. Already Exists in Customer!'});
		}


		// Find the last employee to generate the next employee ID
		const lastEmp = await EmployeeModel.findOne({
			order: [
				['id', 'DESC']
			]
		});

		let nextEmpId;
		if (lastEmp) {
		const lastEmpId = parseInt(lastEmp.emp_id.replace("EMP", ""), 10); // Convert to an integer
		nextEmpId = "EMP" + String(lastEmpId + 1).padStart(4, '0'); // Pad the number with leading zeros
		} else { // If no employee found in the database, start with EMP0001
		nextEmpId = "EMP0001";
		}
		data.emp_id = nextEmpId;

		// Create the new employee
		const empData = await EmployeeModel.create(data);

		if (! empData) { // If employee creation failed
			return res.status(400).json({status: 400, error: true, message: "Failed to register employee. Please try again."});
		}

		const addService = await Promise.all(empServiceData.map(async (service) => {
			return Empservices.create({
				service_name: service, // Directly use the string
				mobile_no: empData?.mobile_no
			});
		}));

		return res.status(200).json({status: true, message: "Employee Added Successfully!"});
	} catch (error) { // If an unexpected error occurs
		return res.status(500).json({
			status: false,
			error: true,
			message: "Internal server error." + error.message
		});
	}
};

const roles = {
	admin: "Admin",
	office: "Back Office",
	supervisor: "Superviser"
};

const LoginEmployee = async (req, res) => {
	const {number, otp, otpid} = req.query;
	const {logger} = req.params;
	try {
		const isVerified = await isOptValid(otp, otpid);
		if (! isVerified) {


			return res.status(400).json({error: true, message: "Otp Expired or Invalid"});
		}
		// find the uer
		const isUser = await EmployeeModel.findOne({
			include: [
				{
					model: DesignationModel
				},
			],
			where: {
				mobile_no: number
			}
		});


		// const LoginEmp=await

		if (! isUser) {
			return res.status(204).json({error: true, message: "No user found"});
		}

		// res.status(200).json(isUser.designation.name);
		if (isUser.designation.name !== roles[logger]) {

			return res.status(204).json({error: true, message: "Please Login In As per your Post "});
		}


		// compare the password

		// Convert the Mongoose document to a plain JavaScript object
		// const userWithoutPassword = isUser.toObject();
		// delete userWithoutPassword.password;
		// Remove the password from the object

		// generate the jwt token
		// const token = jwt.sign(process.env.SECRET_CODE);
		// res.header("access-token", token);
		res.status(200).json(isUser);
	} catch (error) {
		res.status(500).json({error});
	}
};


// delete the data by id
const DeleteTheEmployeeData = async (req, res) => {
	const id = req.params.id;

	try {
		const isDeleted = await EmployeeModel.destroy({
			where: {
				emp_id: id
			}
		});
		if (! isDeleted) 
			return res.status(400).json({error: true, message: "Not deleted try Again"});
		


		res.status(200).json({status: 200, message: "Deleted Successfully"});
	} catch (error) {
		res.status(500).json({error});
	}
};

// Delete all
const DeleteAllEmployeeData = async (req, res) => {
	try {
		const isDeleted = await EmployeeModel.deleteMany({});
		if (isDeleted) {
			res.status(200).json({error: false, message: "Deleted Successfully"});
		} else {
			res.status(400).json({error: true, message: "Not deleted"});
		}
	} catch (error) {
		res.status(500).json({error});
	}
};

// get all the service provider

const GetAllEmployeeData = async (req, res) => {

	const data = req.query;

	try {
		const result = await EmployeeModel.findAll({
			attributes: [
				"id",
				"name",
				"emp_id",
				"name",
				"about",
				"image",
				"mobile_no",
				"aadhar_no",
				"pan_no",
				"alterno",
				"address",
				"doj",
				"salary",
				"week_off",
				"duty_hours",
				"createdAt",
				"is_block",
				"v_name",
				"v_date",
				"f_name",
				"f_mobile",
				"m_name",
				"m_mobile",
				"gender",
				"email"
			],
			include: [
				{
					model: DepartmentModel,
					attributes: ["name", "id"]
				}, {
					model: DesignationModel,
					attributes: ['name', "id"]
				}, {

					model: Empservices,
					attributes: ['service_name']
				},
			],
			order: [
				['id', 'DESC']
			]
		});


		if (!data || !data.date || !data.time_range) {
			return res.status(200).json({error: false, data: result});
		}


		const Available = await SupervisorAvailability.findAll({
			attributes: ['emp_id'],
			where: {
			  date: data.date,
			  [data.time_range]: "p"
			}
		  });
		  
		  const availableEmpIds = Available.map(entry => entry.dataValues.emp_id);
		  const serviceProvider = result
				.filter(entry => entry.dataValues.is_block !== 1)
				.map(entry => entry.dataValues);
	
		const filterData = serviceProvider.filter(item => availableEmpIds.includes(item.emp_id.toString()));

		if (filterData.length === 0){
			return res.status(202).json({error: true, message: "No Data Found"});
		}
	return	res.status(200).json({error: false, data: filterData});

	} catch (error) {
		return res.status(500).json({error});
	}
};

// get data by id
const GetEmployeeById = async (req, res) => {
	const id = req.params.id;

	try {
		const result = await EmployeeModel.findById(id);
		if (! result) 
			return res.status(404).json({error: true, message: "No User Found"});
		


		res.status(200).json({error: false, data: result});
	} catch (error) {
		res.status(500).json({error});
	}
};

const UpdateTheEmployeeData = async (req, res) => {
    const emp_id = req.params.id;
    const data = req.body;

    try {
        // Check if employee exists
        const isEmployee = await EmployeeModel.findOne({
            where: {
                id: emp_id
            }
        });

        if (!isEmployee) {
            return res.status(200).json({ status: false, message: "Employee not found!" });
        }

		const isServiceProvider = await ServiceProviderModel.findOne({
			where:{
				mobile_no: data.mobile_no
			}
		});

		if (isServiceProvider) {
			return res.status(200).json({status:false, message: 'Mobile No. Already Exists in Service Provider!'});
		}

		const isCustomer = await NewCustomerModel.findOne({
			where:{
				mobileno: data.mobile_no
			}
		});

		if (isCustomer) {
			return res.status(200).json({status:false, message: 'Mobile No. Already Exists in Customer!'});
		}

        // Handle file uploads if present
        if (req.files) {
            const { pan_image, adhar_image, image } = req.files;

            if (pan_image && pan_image[0]?.filename) {
                data.pan_image = pan_image[0].filename;
            }

            if (adhar_image && adhar_image[0]?.filename) {
                data.adhar_image = adhar_image[0].filename;
            }

            if (image && image[0]?.filename) {
                data.image = image[0].filename;
            }
        }

        // Update employee data
        const updateResult = await EmployeeModel.update(data, {
            where: {
                id: emp_id
            }
        });

        if (!updateResult || updateResult[0] === 0) {
            return res.status(400).json({ status: false, message: "Employee data not updated!" });
        }

        // Delete existing services
        const existingServices = await Empservices.findAll({
            where: {
                mobile_no: data.mobile_no // Assuming mobile_no is a unique identifier for services
            }
        });

        if (existingServices.length > 0) {
            await Empservices.destroy({
                where: {
                    mobile_no: data.mobile_no
                }
            });
        }

        // Add new services
        if (data.multiServices) {
            const empServiceData = JSON.parse(data.multiServices);
            const addService = await Promise.all(empServiceData.map(async (service) => {
                return Empservices.create({
                    service_name: service,
                    mobile_no: data.mobile_no
                });
            }));
        }

        return res.status(200).json({ status: true, message: "Employee data updated successfully!" });
    } catch (error) {
        return res.status(500).json({ error: true, message: `Internal Server Error: ${error.message}` });
    }
};


// UpdateEmployeeStatus

const UpdateEmployeeStatus = async (req, res) => {
	const user_id = req.params.id
	try {
		const is_block = req.body;

		const isEmployee = await EmployeeModel.findOne({
			where: {
				id: user_id
			}
		});

		if (! isEmployee) {
			res.status(200).json({status: false, message: "User Not Found!"})
		}

		const data = await EmployeeModel.update(is_block, {
			where: {
				id: user_id
			}
		});
		if (data) {
			res.status(200).json({status: true, message: "Block Successfully"})
		}
	} catch (error) {
		res.status(500).json("Internal Server error" + error);
	}
}

const GetAllSupervisor = async (req, res) => {
	try {
		const result = await EmployeeModel.findAll({
			include: [
				{
					model: DepartmentModel

				}, {
					model: DesignationModel
				},
			],
			order: [
				['id', 'DESC']
			],
			where: {
				designation_id: 2,
				is_block: false
			}
		});
		if (! result) 
			return res.status(400).json({error: true, message: "No Data Found"});
		


		res.status(200).json({status: 200, data: result});
	} catch (error) {
		res.status(500).json({error});
	}
};


module.exports = {
	AddEmployee,
	LoginEmployee,
	UpdateTheEmployeeData,
	DeleteTheEmployeeData,
	DeleteAllEmployeeData,
	GetAllEmployeeData,
	GetEmployeeById,
	UpdateEmployeeStatus,
	GetAllSupervisor
};
