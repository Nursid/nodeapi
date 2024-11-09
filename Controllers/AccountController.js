const db = require("../model/index")
const {Sequelize, Model, DataTypes} = require('sequelize');
const Op = Sequelize.Op;
const AccountModel = db.Account
const moment = require('moment')
const sequelize = require('../config/sequalize');

const ListingAccount = async (req, res) => {
	const { from, to } = req.query;
  
	try {
	  let dateCondition = {};
  
	  // Check if both from and to exist
	  if (from && to) {
		// Convert and validate provided dates
		const startDate = new Date(from);
		const endDate = new Date(to);
		
		if (isNaN(startDate) || isNaN(endDate)) {
		  return res.status(400).json({ message: "Invalid date format" });
		}
  
		dateCondition = {
		  date: {
			[Op.between]: [startDate, endDate]
		  }
		};
	  } else if (from) {
		// If only 'from' exists, filter by date greater than or equal to 'from'
		const startDate = new Date(from);
		if (isNaN(startDate)) {
		  return res.status(400).json({ message: "Invalid 'from' date format" });
		}
  
		dateCondition = {
		  date: {
			[Op.gte]: startDate
		  }
		};
	  } else if (to) {
		// If only 'to' exists, filter by date less than or equal to 'to'
		const endDate = new Date(to);
		if (isNaN(endDate)) {
		  return res.status(400).json({ message: "Invalid 'to' date format" });
		}
  
		dateCondition = {
		  date: {
			[Op.lte]: endDate
		  }
		};
	  }
  
	  // Query the database with the date condition
	  const data = await AccountModel.findAll({
		where: dateCondition
	  });
  
	  if (data.length === 0) {
		return res.status(204).json({ error: true, message: "No data found" });
	  }
  
	  res.status(200).json({ status: true, data });
  
	} catch (error) {
	  console.error(error);
	  res.status(400).json({ message: "Invalid request" });
	}
  };
  

const AddBalance = async (req, res) => {
	try {
		const data = req.body;
		data.date = moment(new Date()).format('YYYY-MM-DD');

		// Check if the order_no exists
		const existingAccount = await AccountModel.findOne({
			where: { order_no: data?.order_no 
			}
			});

		if (existingAccount) {
			// If exists, update the existing record
			await AccountModel.update(data, {
				where: {
					order_no: data?.order_no
				}
			});
			return res.status(200).json({ status: true, message: "Amount Updated Successfully!" });
		} else {
			// If not exists, create a new record
			const newAccount = await AccountModel.create(data);
			return res.status(200).json({ status: true, message: "Amount Added Successfully!" });
		}
	} catch (error) {
		console.error('Error:', error); // Log the error for debugging
		res.status(400).json({ message: "Invalid URL or data" });
	}
}


const EditBalnace = async (req, res) => {

	try {

		const amount_id = req.params.id;
		const data = req.body;

		const IsAmount = await AccountModel.findOne({
			where: {
				id: amount_id
			}
		});
		if (!IsAmount) {
			res.status(204).json({error: true, message: "Not Found Data"});
		}
		await AccountModel.update(data, {
			where: {
				id: amount_id
			}
		});
		res.status(200).json({status: true, message: "Amount Updated Successfully!"});
	} catch (error) {
		res.status(400).json({message: "Invalid url"});
	}
}


const TotalAmount = async (req, res) => {
	try {

        let startDate="", endDate="";

        switch (parseInt(req.query.date)) {
            case 1: // Today
                startDate = moment().startOf('day').toDate();
                endDate = new Date();
                break;
            case 3: 
            var today = moment();
               // Get the start date of the previous month
            startDate = today.clone().startOf('month').toDate();

            // Get the end date of the previous month
            endDate = new Date();
                break;
            case 6: 
			var today = moment();
                // Get the start date of 6 months ago
            startDate = today.clone().subtract(6, 'months').startOf('month').toDate();
            // Get the end date of the current month
            endDate = new Date();
                break;
            default:
                startDate = new Date(); // Earliest date possible
                endDate = new Date(); // Current date
                break;
        }

		const data = await AccountModel.findAll({
			attributes: [
				[sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
				[sequelize.fn('SUM', sequelize.literal("CASE WHEN payment_mode = 'Cash' THEN amount ELSE 0 END")), 'total_cash'],
				[sequelize.fn('SUM', sequelize.literal("CASE WHEN payment_mode = 'Online' THEN amount ELSE 0 END")), 'total_online']
			],
			where: {
				type_payment: 0,
				createdAt: {
					[Op.between]: [startDate, endDate]
				}
			}
			
		});
		
		if (! data) {
			res.status(200).json({status: false, message: "Not Found Data"});
		}
		res.status(200).json({status: true, data: data})
	} catch (error) {
		res.status(400).json({
			message: "Inter Server Error" + error
		})
	}
}

const FilterAmount = async (req, res) => {
	try {
        const data=req.body;
        
        let startDate="", endDate="";

        switch (parseInt(date)) {
            case 1: // Today
                startDate = moment().startOf('day').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            case 3: 
                startDate = moment().subtract(1, 'month').startOf('month').toDate();
                endDate = moment().subtract(1, 'month').endOf('month').toDate();
                break;
            case 6: 
                startDate = moment().subtract(6, 'months').startOf('month').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            default:
                return res.status(400).json({ error: 'Invalid date parameter' });
        }

		const Isdata = await AccountModel.findAll({
			where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }
		});
		if (! data) {
			res.status(200).json({status: false, message: "Not Found Data"});
		}
		res.status(200).json({status: true, data: Isdata})
	} catch (error) {
		res.status(400).json({
			message: "Inter Server Error" + error
		})
	}
}


const AddExpense = async (req, res) => {
	try {
		const data = req.body;
		data.date = moment(new Date()).format('YYYY-MM-DD');

		// Check if the order_no exists
			// If not exists, create a new record
			const newAccount = await AccountModel.create(data);
			return res.status(200).json({ status: true, message: "Expense Added Successfully!" });
	} catch (error) {
		console.error('Error:', error); // Log the error for debugging
		res.status(400).json({ message: "Invalid URL or data" });
	}
}


const AddFund = async (req, res) => {
	try {
		const data = req.body;

		const newAccount = await AccountModel.create(data);
		return res.status(200).json({ status: true, message: "Amount Added Successfully!" });

	} catch (error) {
		console.error('Error:', error); // Log the error for debugging
		res.status(400).json({ message: "Invalid URL or data" });
	}
}


module.exports = {
	ListingAccount,
	AddBalance,
	TotalAmount,
	EditBalnace,
    FilterAmount,
	AddExpense,
	AddFund
}
