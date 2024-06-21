require("dotenv").config();
const db = require("../../model/index");
const EmployeeModel = db.EmployeeModel;
const DepartmentModel = db.DepartmentsModel
const DesignationModel = db.DesignationModel
const Empservices = db.Empservices
const jwt = require("jsonwebtoken");
const {isEmail, isMobileNumber, isOptValid} = require("../utils");

// Add the Service Provider
const AddEmployee = async (req, res) => {
	
	try {
		const data = req.body;

		const empServiceData = JSON.parse(data.multiServices);

		const {pan_image, adhar_image, image} = req.files;

		data.pan_image = pan_image ? pan_image[0].filename : null;
		data.adhar_image = adhar_image ? adhar_image[0].filename : null;
		data.image = image ? image[0].filename : null;

		// Check if user with the provided mobile number already exists
		const isUser = await EmployeeModel.findOne({
			where: {
				mobile_no: data.mobile_no
			}
		});
		if (isUser) {
			return res.status(202).json({status: 202, message: "User Already Registered with this Mobile No."});
		}

		// Find the last employee to generate the next employee ID
		const lastEmp = await EmployeeModel.findOne({
			order: [
				['id', 'DESC']
			]
		});

		let nextEmpId;
		if (lastEmp) {
			const lastEmpId = parseInt(lastEmp.emp_id.replace("EMP", ""));
			nextEmpId = "EMP" + (
				lastEmpId + 1
			);
		} else { // If no employee found in the database, start with EMP1
			nextEmpId = "EMP1";
		} data.emp_id = nextEmpId;

		// Create the new employee
		const empData = await EmployeeModel.create(data);

		if (! empData) { // If employee creation failed
			return res.status(400).json({status: 400, error: true, message: "Failed to register employee. Please try again."});
		}

		const addService = await Promise.all(empServiceData.map(async (service) => {
			console.log(service); // Logging the service name
			return Empservices.create({
				service_name: service, // Directly use the string
				emp_no: empData.mobile_no
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
				"address",
				"doj",
				"salary",
				"week_off",
				"duty_hours",
				"createdAt",
				"is_block"
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
		if (! result) 
			return res.status(400).json({error: true, message: "No Data Found"});
		


		res.status(200).json({status: 200, data: result});
	} catch (error) {
		res.status(500).json({error});
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

	try {
		const emp_id = req.params.id;
		const data = req.body


		const empServiceData = JSON.parse(data.multiServices);

		const {pan_image, adhar_image, image} = req.files;

		data.pan_image = pan_image ? pan_image[0].filename : null;
		data.adhar_image = adhar_image ? adhar_image[0].filename : null;
		data.image = image ? image[0].filename : null;
		
		const isEmployee = await EmployeeModel.findOne({
			where: {
				id: emp_id
			}
		});
		if (! isEmployee) {
			return res.status(200).json({status: false, message: "Employee Not Found!"})
		}
		const isdata = await EmployeeModel.update(data, {
			where: {
				id: emp_id
			}
		});

		if (! isdata) {
			return res.status(200).json({status: false, message: "Employee Not Updated!"})
		}
		return res.status(200).json({status: true, message: "Employee has been Updated!"})

	} catch (error) {
		return res.status(500).json({error: true, message: "Internal Server Error "})
	}
}

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
