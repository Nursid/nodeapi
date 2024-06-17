const db = require("../model/index")
const {Sequelize, Model, DataTypes} = require('sequelize');
const Op = Sequelize.Op;
const AccountModel = db.Account
const moment = require('moment')

const ListingAccount = async (req, res) => {
	try {
		const data = await AccountModel.findAll({
			order: [
				['id', 'DESC']
			]
		});
		if (! data) {
			res.status(204).json({error: true, message: "Not found data"});
		}
		res.status(200).json({status: true, data: data});
	} catch (error) {
		res.status(400).json({message: "Invalid url"});
	}
}

const AddBalnace = async (req, res) => {
	try {
		const data = req.body;
		const Amount = await AccountModel.create(data);
		if (! Amount) {
			res.status(204).json({error: true, message: "Not Found Data"});
		}
		res.status(200).json({status: true, message: "Amount Added Successfully!"});
	} catch (error) {
		res.status(400).json({message: "Invalid url"});
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
		if (! IsAmount) {
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
                startDate = new Date(0); // Earliest date possible
                endDate = new Date(); // Current date
                break;
        }

		const data = await AccountModel.findAll({
			attributes: [
				[
					Sequelize.fn('SUM', Sequelize.col('cash')),
					'total_cash'
				],
				[
					Sequelize.fn('SUM', Sequelize.col('upi')),
					'total_upi'
				]
			],
            where: {
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

module.exports = {
	ListingAccount,
	AddBalnace,
	TotalAmount,
	EditBalnace,
    FilterAmount
}
