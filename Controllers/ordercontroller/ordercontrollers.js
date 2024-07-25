// const CustomerModel = require("../../Models/AuthModels/CustomerModel");
// const CustomerID = require("../../Models/misc/customerId");
// const OrderModel = require("../../Models/ordermodel/ordermodel");
const generateOrderNo = require("../misc/orderNoGenerator");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require("../../model/index");
const CustomerModel = db.CustomerModel
const CustomerID = db.CustomerID
const OrderModel = db.OrderModel
const NewCustomerModel = db.NewCustomerModel
const OrderProcessModel = db.OrderProcessModel
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
const MonthlyServiceModel = db.MonthlyServiceModel
const AddExpenseModel = db.AddExpenseModel
const AccountModel = db.Account

const GetOrderNow = async (req, res) => {
	try {
		const formdata = req.body;

		const {id} = req.params;
		// find user with id
		const isUser = await NewCustomerModel.findOne({
			where: {
				id: id
			}
		})
		if (! isUser) {
			return res.status(404).json({error: true, message: "Invalid user"})
		}

		const lastOrder = await OrderModel.findOne({
			order: [
				['id', 'DESC']
			]
		});

		let OrderNo;

		if (! lastOrder) {
			OrderNo = 50825;
		} else {
			OrderNo = parseInt(lastOrder.order_no) + 1;
		} 
		formdata.order_no = OrderNo
		formdata.registered_id = id

		const isSubmit = await OrderProcessModel.create(formdata);
		if (! isSubmit) {
			return res.status(400).json({error: true, message: "order not placed i! Try again"})
		}

		const OrderData = {
			// service_name: formdata.service_name,
			// user_type: formdata?.user_type,
			// bookdate: formdata?.bookdate,
			// booktime: formdata?.booktime,
			// problem_des: formdata?.problem_des,
			...formdata,
			create_date: isSubmit.serviceDateTime,
			cust_id: id,
			city: isSubmit.city,
			suprvisor_id: isSubmit.supervisor_name,
			pending: 0,
			order_no: OrderNo,
			service_address: isSubmit.address
		}
		const data = await OrderModel.create(OrderData);
		if (! data) {
			return res.status(400).json({error: true, message: "order not placed i! Try again"})
		}

		res.status(200).json({message: "successfully ordered", data: data})
	} catch (error) {
		res.status(500).json(error)
	}
}

const OrderComplain = async (req, res) => {
	try {
		const formdata = req.body;

		const lastOrder = await OrderModel.findOne({
			order: [
				['id', 'DESC']
			]
		});

		let OrderNo = parseInt(lastOrder.order_no) + 1;;

		formdata.order_no = OrderNo

		const isSubmit = await OrderProcessModel.create(formdata);
		if (! isSubmit) {
			return res.status(400).json({error: true, message: "order not placed i! Try again"})
		}


		const OrderData = {
			... formdata,
			create_date: isSubmit.serviceDateTime,
			pending: 0,
			order_no: OrderNo
		}

		const data = await OrderModel.create(OrderData);
		if (! data) {
			return res.status(400).json({error: true, message: "order not placed i! Try again"})
		}

		res.status(200).json({message: "successfully ordered", data: isSubmit})
	} catch (error) {
		res.status(500).json(error)
	}
}

// get  the order update
const GetOrderUpdate = async (req, res) => {
	try {
		const orderID = req.params.id
		const data = req.body

		const orderData = {
			"name": data.name,
			"email": data.email,
			"city": data.city
		}

		console.log(orderData)

		const {
			email,
			name,
			...order_data
		} = data;


		const isUpdated = await OrderModel.update(order_data, {
			where: {
				order_no: orderID
			}
		})
		const isUpdated2 = await OrderProcessModel.update(orderData, {
			where: {
				order_no: orderID
			}
		});

		if (! isUpdated && ! isUpdated2) {
			return res.status(400).json({error: true, message: 'Updation Failed ! Try again'})
		}
		res.status(200).json({status: 200, message: "Updated Successfull!"})
	} catch (error) {
		res.status(200).json({error})
	}
}

// Get Single Order
const GetSingleOrder = async (req, res) => {
	const id = req.params.id
	const cust_id = req.params.cust_id
	try {
		const isData = await OrderModel.findOne({
			include: [
				{
					model: NewCustomerModel
				}
			],
			where: {
				order_no: id,
				cust_id: cust_id
			}
		});
		if (! isData) {
			return res.status(404).json({error: true, message: "No order Found with This"})
		}

		res.status(200).json({status: 200, data: isData})

	} catch (error) {
		res.status(500).json({error})
	}
}

// Delete Order
const GetDeleteByID = async (req, res) => {
	const orderId = req.params.order_no
	try {
		const DeleteOrder = await OrderModel.destroy({
			where: {
				order_no: orderId // Specify the order_no you want to delete
			}
		});

		const deletedRows = await OrderProcessModel.destroy({
			where: {
				order_no: orderId // Specify the order_no you want to delete
			}
		});

		res.status(200).json({status: 200, message: 'deleted successfully'})
	} catch (error) {
		res.status(500).json({error})
	}
}

const GetAllOrders = async (req, res) => {
	try {

		const orders = await OrderModel.findAll({
			order: [
				['id', 'DESC']
			]
		});

		const addService = await Promise.all(orders.map(async (item) => {
			const orderProcess = await OrderProcessModel.findOne({
				where: {
					order_no: item.order_no
				}
			});
			return {
				...item.dataValues,
				orderProcess
			};
		}));

		res.status(200).json({status: 200, data: addService});

	} catch (error) {
		res.status(500).json({error: "Internally Error "});
	}
}

const GetByStatus = async (req, res) => {
	const status = req.params.status
	try {
		const orders = await OrderModel.findAll({
			where: {
				pending: status
			}
		});

		const addService = await Promise.all(orders.map(async (item) => {
			const orderProcess = await OrderProcessModel.findOne({
				where: {
					order_no: item.order_no
				}
			});
			return {
				...item.dataValues,
				orderProcess
			};
		}));

		res.status(200).json({status: 200, data: addService})

	} catch (error) {
		res.status(500).json({error: "Internally Error "});
	}
}



















const GetCancel = async (req, res) => {
	try {
		const order_no = req.params.order_no
		const data = req.body;
		console.log(data)
		const isUpdated = await OrderModel.update(data, {
			where: {
				order_no: order_no
			}
		});

		if (! isUpdated) {
			res.status(202).json({massage: "please Try again"});
		}
		res.status(200).json({massage: "Your Order has Cancelled"});
	} catch (error) {
		res.status(500).json({error: "Internally Error "});
	}
}

const GetHold = async (req, res) => {
	try {
		const cust_id = req.params.cust_id
		const order_no = req.params.order_no
		const isUpdated = await OrderModel.update({
			pending: 1
		}, {
			where: {
				cust_id: cust_id,
				order_no: order_no
			}
		});
		if (! isUpdated) {
			res.status(404).json({error: "please Try again"});
		}
		res.status(200).json({massage: "Your Order has been Hold"});
	} catch (error) {
		res.status(500).json({error: "Internally Error "});
	}
}

const GetCompleted = async (req, res) => {
	try {

		const order_no = req.params.order_no
		const isUpdated = await OrderModel.update({
			pending: 3
		}, {
			where: {
				order_no: order_no
			}
		});
		if (! isUpdated) {
			res.status(404).json({error: "please Try again"});
		}
		res.status(200).json({massage: "Your Order has been Completed!"});
	} catch (error) {
		res.status(500).json({error: "Internally Error "});
	}
}

const GetOrderByID = async (req, res) => {
	try {
		const user_id = req.params.id

		const orders = await OrderModel.findAll({
			where: {
				cust_id: user_id
			},
			order: [
				['id', 'DESC']
			]
		});

		const orderData = await Promise.all(orders.map(async (item) => {
			const orderProcess = await OrderProcessModel.findOne({
				where: {
					order_no: item.order_no
				}
			});
			return {
				...item.dataValues,
				orderProcess
			};
		}));

		res.status(200).json({status: 200, data: orders})

	} catch (error) {
		return res.status(500).json({status: false, message: "Interal Error"})
	}
}

const OrderAssing = async (req, res) => {
	try {
		const orderID = req.params.id
		const data = req.body
		const isUpdated = await OrderModel.update(data, {
			where: {
				order_no: orderID
			}
		})

		if (! isUpdated) {
			return res.status(400).json({error: true, message: 'Updation Failed ! Try again'})
		}
		res.status(200).json({status: 200, message: "Assign Successfull!"})
	} catch (error) {
		res.status(200).json("Internal Server Error");
	}
}

const GetOrderAssing = async (req, res) => {
	try {
		const serPID = req.params.id
		const isServiceProvider = await ServiceProviderModel.findOne({
			where: {
				id: serPID
			}
		});
		if (! isServiceProvider) {
			return res.status(400).json({error: true, message: 'Updation Failed ! Try again'})
		}
		const orders = await OrderModel.findAll({
			where: {
				servicep_id: isServiceProvider.name
			},
			order: [
				['id', 'DESC']
			]
		});

		const addService = await Promise.all(orders.map(async (item) => {
			const orderProcess = await OrderProcessModel.findOne({
				where: {
					order_no: item.order_no
				}
			});
			return {
				...item.dataValues,
				orderProcess
			};
		}));

		res.status(200).json({status: 200, data: addService})

	} catch (error) {
		res.status(200).json("Internal Server Error");
	}
}

const GetOrderAssingwithSupervisor = async (req, res) => {
	try {
		const supvisorID = req.params.id
		const status_id = req.query.status_id || undefined;


		const isSupervisor = await EmployeeModel.findOne({
			where: {
				id: supvisorID
			}
		});
		if (! isSupervisor) {
			return res.status(200).json({status: false, message: 'User Not Found!'})
		}


		const whereConditions = {
			suprvisor_id: isSupervisor.name
		};

		if (status_id !== undefined) {
			whereConditions.pending = status_id;
		}


		const orders = await OrderModel.findAll({
			where: whereConditions,
			order: [
				['id', 'DESC']
			]
		});

		const allSupervisor = await Promise.all(orders.map(async (item) => {
			const orderProcess = await OrderProcessModel.findOne({
				where: {
					order_no: item.order_no
				}
			});
			return {
				...item.dataValues,
				orderProcess
			};
		}));

		res.status(200).json({status: 200, data: allSupervisor})

	} catch (error) {
		res.status(500).json({
			status: false,
			messsage: "Internal Server Error" + error
		});
	}
}

const GetOrderAssingwithStatus = async (req, res) => {
	try {
		const sup_id = req.params.sup_id
		const status_id = req.params.status_id

		const isServiceProvider = await ServiceProviderModel.findOne({
			where: {
				id: sup_id
			}
		});

		if (! isServiceProvider) {
			return res.status(400).json({error: true, message: 'Updation Failed ! Try again'})
		}
		const orders = await OrderModel.findAll({
			where: {
				servicep_id: isServiceProvider.name,
				pending: status_id
			}
		});

		const addService = await Promise.all(orders.map(async (item) => {
			const orderProcess = await OrderProcessModel.findOne({
				where: {
					order_no: item.order_no
				}
			});
			return {
				...item.dataValues,
				orderProcess
			};
		}));

		res.status(200).json({status: 200, data: addService})

	} catch (error) {
		res.status(200).json("Internal Server Error");
	}
}

const GetLastOrderByMobile = async (req, res) => {
	try {
		const customers = await NewCustomerModel.findAll();

		const data = [];
		for (const item of customers) {
			try { // Fetch the most recent order for the current customer
				const orders = await OrderProcessModel.findOne({
					where: {
						mobile: item.mobileno
					},
					order: [
						['id', 'DESC']
					] // Sorting to get the most recent order
				});

				// Only consider customers with orders
				if (orders) { // Fetch the order process details for the most recent order
					const orderProcess = await OrderModel.findOne({
						where: {
							order_no: orders.order_no
						}
					});

					// Combine customer details, order details, and order process details
					data.push({
						... item.dataValues,
						orders: orders.dataValues,
						orderProcess
					});
				}

			} catch (error) { // Log the error (consider more sophisticated error logging depending on your setup)
				console.error(`Error processing customer ${
					item.id
				}: ${error}`);
				// Optionally, handle errors specifically or add error information in the log/output
				// Continue to the next iteration, skipping any error processing for this customer
				continue;
			}
		}

		res.status(200).json({status: 200, data: data})

	} catch (error) {
		return res.status(500).json({status: false, message: "Interal Error"})
	}
}

const GetTotalSummary = async (req, res) => {
    let { from, to } = req.query;

    try {
        // Parse and validate date inputs
        from = !from || isNaN(new Date(from)) ? new Date(0) : new Date(from);
        to = !to || isNaN(new Date(to)) ? new Date() : new Date(to);
        to.setHours(23, 59, 59, 999); // Set to end of the day

        const dateFilter = {
            createdAt: {
                [Op.between]: [from, to]
            }
        };

        // Fetching all necessary data in parallel
        const [orders, monthlyServices, Allexpense, TotalAcount] = await Promise.all([
            OrderModel.findAll({ where: dateFilter }),
            MonthlyServiceModel.findAll({ where: dateFilter }),
            AddExpenseModel.findAll({ where: dateFilter }),
            AccountModel.findAll({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('cash')), 'total_cash'],
                    [Sequelize.fn('SUM', Sequelize.col('upi')), 'total_upi']
                ],
                where: dateFilter
            })
        ]);

        // Calculating totals
        const totalOrders = orders.length;
        const totalCompleted = orders.filter(order => order.pending === 3).length;
        const totalCancel = orders.filter(order => order.pending === 5).length;
        const totalHold = orders.filter(order => order.pending === 1).length;
        const totalPending = orders.filter(order => order.pending === 0).length;
        
        const totalMonthlyService = monthlyServices.length;
        const TotalserviceFees = monthlyServices.reduce((total, service) => total + parseFloat(service.serviceFees), 0);
        
        const TotalExpenses = Allexpense.reduce((total, expense) => total + parseFloat(expense.amount), 0);
        
        // Constructing summary object
        const summary = {
            totalOrders,
            totalCompleted,
            totalCancel,
            totalHold,
            totalPending,
            totalMonthlyService,
            TotalserviceFees,
            TotalExpenses,
			TotalCash: TotalAcount[0]?.dataValues?.total_cash || 0,
			TotalBank: TotalAcount[0]?.dataValues?.total_upi || 0
        };

        // Sending the summary as JSON response
        res.status(200).json({ status: 200, data: summary });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = GetTotalSummary;




module.exports = {
	GetAllOrders,
	GetOrderNow,
	GetOrderUpdate,
	GetSingleOrder,
	GetDeleteByID,
	GetCancel,
	GetHold,
	GetCompleted,
	GetByStatus,
	GetOrderByID,
	OrderComplain,
	OrderAssing,
	GetOrderAssing,
	GetOrderAssingwithStatus,
	GetLastOrderByMobile,
	GetOrderAssingwithSupervisor,
	GetTotalSummary
}
