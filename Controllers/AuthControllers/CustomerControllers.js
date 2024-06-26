// const CustomerModel = require("../../Models/AuthModels/CustomerModel");
const jwt = require("jsonwebtoken");

const db = require("../../model/index");
const CustomerModel = db.CustomerModel;
const NewCustomerModel = db.NewCustomerModel

const {isEmail, isMobileNumber, isOptValid} = require("../utils");

const generateCustomerID = db.CustomerID
// const generateCustomerID = require("../misc/customeridgenerator");


// const generateOrderNo = require("../misc/orderNoGenerator");
const generateOrderNo = db.OrderNo

require("dotenv").config;

const SignupUser = async (req, res) => {

	const data = req.body;

	const image=req.file
	data.image=image?.originalname || '';

	const newCustomer_data = {
		"name": data.name,
		"email": data.email,
		"password": data.name,
		"mobileno": data.mobile
	}
	const {
		email,
		name,
		...customer_data
	} = data;

	try {

		const newCustomer = await NewCustomerModel.create(newCustomer_data);

		if (! newCustomer) {
			res.status(500).json({error: 'Your Customer Not Added!'});
		}

		const user_id = newCustomer.id; // replace "your_user_id_here" with the actual user ID

		customer_data.user_id = user_id;

		const formdata = await CustomerModel.create(customer_data);

		res.status(200).json({status: 200, data: formdata});

	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal Server Error'});
	}
};

const LoginUser = async (req, res) => {
	const {number, otp, otpid} = req.query;

	try { // check the data is not equals to null
		if (!number && !otp) {
			return res.status(400).json({error: true, message: "Invalid credentials"});
		}

		// check the otp is Valid or not
		const isVerified = await isOptValid(otp, otpid);
		if (! isVerified) {
			return res.status(404).json({error: true, message: "Otp Invalid or expired"});
		}
		// find the user
		const User = await NewCustomerModel.findOne({
			where: {
				mobileno: number
			}
		});
		if (! User) {
			return res.status(404).json({error: true, message: "NO user found"});
		}
		// // jenerate the jwt token
		// const token = jwt.sign({
		// _id: User._id,
		// name: User.name
		// }, process.env.SECRET_CODE);
		// res.header("access-token", token);
		res.status(200).json(User);
	} catch (error) {
		res.status(500).json(error);
	}
};

const DeleteUsers = (req, res) => {
	try {
		CustomerModel.deleteMany({}).then(() => {
			res.status(200).json("All User Deleted ");
		});
	} catch (error) {
		res.status(500).json(error);
	}
};

const AllCustomer = async (req, res) => {
	try { // Modify the findAll query to include NewCustomerModel with the appropriate association
		const customers = await CustomerModel.findAll({
			include: [
				{
					model: NewCustomerModel,
					// Join condition
				}
			],
			order: [
				['id', 'DESC']
			]
		});

		if (customers.length === 0) 
			return res.status(404).json({error: true, message: "No user found"});
		


		res.status(200).json({status: 200, data: customers});
	} catch (error) {
		res.status(500).json(error);
	}
};

const GetCustomer = async (req, res) => {
	try {
		const id = req.params.id;
		// check the user
		const isUser = await CustomerModel.findOne({
			include: [
				{
					model: NewCustomerModel,
				}
			],
			where:{
				user_id:id
			}
		});
		if (!isUser){ 
			return res.status(404).json({error: true, message: "No user found"});
		}
		res.status(200).json({error: false, data: isUser});
	} catch (error) {
		res.status(500).json(error);
	}
};

const GetDeleteCustomerById = async (req, res) => {
	const user_id = req.params.id;
	try {
		const rowsDeleted = await CustomerModel.destroy({
			where: {
				user_id: user_id
			}
		});

		if (rowsDeleted === 0) {
			return res.status(400).json({error: true, message: "No data found with this id"});
		}

		res.status(200).json({error: false, message: "Deleted successfully"});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({error: true, message: "Internal server error"});
	}
};

// update the customer data
const GetUpdateTheCustomer = async (req, res) => {
	
	try {
	const {user_id} = req.params;

	const data = req.body;
	if(req.file){
			const image=req.file
			data.image = (image && image.originalname) ? image.originalname : null;
		}	

	const newCustomer_data = {
		"name": data?.name || '',
		"email": data?.email || ''
	}

	const {
		email,
		name,
		...customer_data
	} = data;

		const isUpdated_customer = await NewCustomerModel.update(newCustomer_data, {
			where: {
				id: user_id
			}
		});

		if (! isUpdated_customer) {
			return res.status(404).json({error: true, message: "Not User Found!"});
		}
		const isUpdated = await CustomerModel.update(customer_data, {
			where: {
				user_id: user_id
			}
		});

		if (! isUpdated) {
			return res.status(404).json({error: true, message: "Updation failed ! Try again"});
		}
		res.status(200).json({status: 200, message: "updated successfully"});

	} catch (error) {
		res.status(500).json({status: false, message: "Internal Server Error"+error});
	}
};

 const GetupdateBlockStatus = async (req, res) => {

	const {id} = req.params;
	const {is_block} = req.body;

	try {
		const record = await CustomerModel.findOne({
			where: {
				user_id: user_id
			}
		});

		if (! record) {
			return res.status(404).json({error: 'Record not found'});
		}

		// Update the 'is_block' field
		await record.update({is_block: is_block});

		return res.status(200).json({message: 'Block status updated successfully'});
	} catch (error) {
		res.status(500).json({error});
	}
}

const UpdateStatus = async (req, res) => {
	const user_id = req.params.id
	try {
		const is_block = req.body;
		const data = await CustomerModel.update(is_block, {
			where: {
				user_id: user_id
			}
		});
		if (data) {
			res.status(200).json({error: false, message: data})
		}
	} catch (error) {
		res.status(200).json({error: false, message: "Blocked Successfully"});
	}
}


module.exports = {
	SignupUser,
	LoginUser,
	DeleteUsers,
	AllCustomer,
	GetCustomer,
	GetDeleteCustomerById,
	GetUpdateTheCustomer,
	UpdateStatus
};