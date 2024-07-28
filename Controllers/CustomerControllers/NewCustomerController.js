// const NewCustomer = require('./../../Models/CustomerModels/NewCustomerModal');
const Sequelize = require("sequelize")
const {param} = require("../../Routers/Verify");
const db = require("../../model/index");
const NewCustomer = db.NewCustomerModel;
const CustomerModel = db.CustomerModel
const OrderModel= db.OrderModel
const createNewCustomer = async (req, res) => {
	try {
		const customer = NewCustomer(req.body);
		await customer.save();
		res.status(201).json({success: true, message: 'Customer created successfully', data: customer});
	} catch (error) {
		res.status(400).json({success: false, error: error.message});
	}
};
// Get all customers
const getAllNewCustomers = async (req, res) => {
	try {

		const customers = await  CustomerModel.findAll({
			include: [
				{
					model: NewCustomer
				}
			],

			order: [['id', 'DESC']]
		});
		res.status(200).json({success: 200, data: customers});

	} catch (error) {
		res.status(500).json({success: false, error: error.message});
	}
};
// Get a specific customer by ID
const getNewCustomerById = async (req, res) => {
	try {
		const customer = await NewCustomer.findById(req.params.id);
		if (! customer) {
			return res.status(404).json({success: false, error: 'Customer not found'});
		}
		res.status(200).json({success: true, data: customer});
	} catch (error) {
		res.status(500).json({success: false, error: error.message});
	}
};
// Update a customer by ID
const updateNewCustomerById = async (req, res) => {
	try {
		const customer = await NewCustomer.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});
		if (! customer) {
			return res.status(404).json({success: false, error: 'Customer not found'});
		}
		res.status(200).json({success: true, message: 'Customer updated successfully', data: customer});
	} catch (error) {
		res.status(400).json({success: false, error: error.message});
	}
};
// Delete a customer by ID
const deleteNewCustomerById = async (req, res) => {
	try {
		const customer = await NewCustomer.destroy({
			where: {
				id: req.params.id
			}
		});
		if (! customer) {
			return res.status(404).json({success: false, error: 'Customer not found'});
		}
		res.status(200).json({success: 200, message: 'Customer deleted successfully'});
	} catch (error) {
		res.status(500).json({success: false, error: error.message});
	}
};

const getCustomerByMobile = async (req, res) => {
	const mobileno = req.params.mobileno;

	try {

		
		const GetCustId = await NewCustomer.findOne({
			where: {
				mobileno: mobileno
			}
		});
	
		if (!GetCustId) {
			return res.status(202).json({ success: false, message: "User Not Found" });
		}
	
		const customerData = await CustomerModel.findOne({
			attributes: ['address','land_mark','location', 'age', 'member_id'],
			include: [
				{
					model: NewCustomer,
					attributes: ['name','mobileno','id', 'email']
				},
			],
			where: {
				user_id: GetCustId.id
			}
		});

		const recentOrder = await OrderModel.findAll({
			attributes: ['order_no','service_name','service_address','createdAt'],
			where: {
				cust_id: GetCustId.id
			}
		});
	
		const finalData = {
			customerData,
			recentOrder
		};
	
		res.status(200).json({ status: true, data: finalData });
	} catch (error) {
		res.status(404).json({success: false, error: error.message})
	}
}
const UpdateStatus = async (req, res) => {
	const user_id = req.params.id
	try {
		const is_block = req.body;
		const data = await NewCustomer.update(is_block, {
			where: {
				emp_id: emp_id
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
	createNewCustomer,
	getAllNewCustomers,
	getNewCustomerById,
	updateNewCustomerById,
	deleteNewCustomerById,
	getCustomerByMobile
};
