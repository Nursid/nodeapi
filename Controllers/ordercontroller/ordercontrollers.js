const generateOrderNo = require("../misc/orderNoGenerator");
const Sequelize = require('sequelize');
const sequelize = require('../../config/sequalize'); 
const Op = Sequelize.Op;
const db = require("../../model/index");
const { name } = require("ejs");
const CustomerModel = db.CustomerModel
const CustomerID = db.CustomerID
const OrderModel = db.OrderModel
const NewCustomerModel = db.NewCustomerModel
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
const MonthlyServiceModel = db.MonthlyServiceModel
const AddExpenseModel = db.AddExpenseModel
const AccountModel = db.Account
const TimeSlotModel = db.TimeSlotModel
const Availability = db.Availability


const GetOrderNow = async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
	  const formdata = req.body;
	  let userId;
  
	  // Check if the user exists with the provided mobile number and ismember true
	  let isUser = await NewCustomerModel.findOne({
		where: {
		  mobileno: formdata.mobile,
		  ismember: true
		},
		transaction
	  });
  
	  if (!isUser) {
		// Check if the user exists with the provided mobile number and ismember false
		isUser = await NewCustomerModel.findOne({
		  where: {
			mobileno: formdata.mobile,
			ismember: false
		  },
		  transaction
		});
  
		if (!isUser) {
		  // Create new user with ismember set to false
		  const newUser = await NewCustomerModel.create({
			name: formdata.name,
			email: formdata.email,
			mobileno: formdata.mobile,
			ismember: false
		  }, { transaction });
  
		  // Create new entry in CustomerModel
		  await CustomerModel.create({
			user_id: newUser.id,
			address: formdata.address,
			land_mark: formdata.land_mark,
			age: formdata.age
		  }, { transaction });
  
		  userId = newUser.id;
		} else {
		  // Use the existing user's ID
		  userId = isUser.id;
		}
	  } else {
		// Use the existing user's ID
		userId = isUser.id;
	  }
  
	  if (formdata.suprvisor_id || formdata.servicep_id) {
		formdata.pending = 4;
	  } else {
		formdata.pending = 0;
	  }
  
	  const lastOrder = await OrderModel.findOne({
		order: [['id', 'DESC']],
		transaction
	  });
  
	  formdata.order_no = lastOrder ? parseInt(lastOrder.order_no) + 1 : 1;
	  formdata.order_no = formdata.order_no.toString().padStart(4, '0');
	  formdata.cust_id = userId;
  
	  if (formdata?.serviceDateTime) {
		const [bookdate, booktime] =  formdata.serviceDateTime.split('T');
		formdata.bookdate = bookdate;
		formdata.booktime = booktime;
	  }
  
	  const data = await OrderModel.create(formdata, { transaction });
  
	  if (!data) {
		await transaction.rollback();
		return res.status(202).json({ status: false, message: "Order not placed! Try again" });
	  }
  
	  const allot_time_range = formdata.allot_time_range;
	  const serProvider = await ServiceProviderModel.findOne({
		where: { name: formdata.servicep_id },
		transaction
	  });
  
	  if (!serProvider) {
		await transaction.rollback();
		return res.status(202).json({ status: false, message: 'Service Provider not found!' });
	  }
  
	  const AllotData = {
		date: formdata.bookdate,
		[allot_time_range]: formdata.service_name,
		emp_id: serProvider.id,
	  };
  
	  const existingAvailability = await Availability.findOne({
		where: {
		  date: formdata.bookdate,
		  emp_id: serProvider.id,
		},
		transaction
	  });
  
	  // Check if the record exists and if the dynamic field already has a value
	  if (existingAvailability) {
		if (existingAvailability[allot_time_range]) {
		  await transaction.rollback();
		  return res.status(202).json({ status: false,
			message: 'Already assigned to someone at this time range.',
		  });
		} else {
		  await existingAvailability.update({
			[allot_time_range]: formdata.service_name,
		  }, { transaction });
  
		  await transaction.commit();
		  return res.status(200).json({ status: true, message: 'Availability updated successfully.' });
		}
	  } else {
		await Availability.create(AllotData, { transaction });
		await transaction.commit();
		return res.status(200).json({ status: true, message: 'Availability created successfully.' });
	  }
	} catch (error) {
	  await transaction.rollback(); // Rollback transaction in case of error
	  res.status(500).json({ error: true, message: error.message });
	}
  };
  
  
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


		const isUpdated = await OrderModel.update(data, {
			where: {
				order_no: orderID
			}
		})

		if (! isUpdated) {
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
	const orderId = req.params.order_no;
	try {
		const deletedOrder = await OrderModel.destroy({
			where: {
				order_no: orderId
			}
		});

		if (deletedOrder === 0) {
			return res.status(404).json({ status: 404, message: 'Order not found' });
		}

		res.status(200).json({ status: 200, message: 'Order deleted successfully' });
	} catch (error) {
		console.error("Error in GetDeleteByID:", error);
		res.status(500).json({ status: 500, error: "Internal Server Error" });
	}
}

const GetAllOrders = async (req, res) => {
	try {

		const orders = await OrderModel.findAll({
			include: {
				model: NewCustomerModel,
				attributes: ['name', 'email', 'mobileno'],
				include: {
					model: CustomerModel,
					attributes: ['age', 'address', 'member_id'],
				}
			},
			order: [['id', 'DESC']]
		});

		res.status(200).json({ status: 200, data: orders });
	} catch (error) {
		console.error("Error in GetAllOrders:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

const GetByStatus = async (req, res) => {
	const status = req.params.status
	try {
	
		const orders = await OrderModel.findAll({
			include: {
				model: NewCustomerModel,
				attributes: ['name', 'email', 'mobileno'],
				include: {
					model: CustomerModel,
					attributes: ['age', 'address', 'member_id'],
				}
			},
			order: [['id', 'DESC']],
			where: {
				pending: status
			}
		});

		res.status(200).json({status: 200, data: orders})

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
			include: {
				model: NewCustomerModel,
				attributes: ['name', 'email', 'mobileno'],
				include: {
					model: CustomerModel,
					attributes: ['age', 'address', 'member_id'],
				}
			},
			order: [['id', 'DESC']],
			where: {
				cust_id: user_id
			},
		});

		res.status(200).json({status: 200, data: orders})

	} catch (error) {
		return res.status(500).json({status: false, message: "Interal Error"})
	}
}

const OrderAssing = async (req, res) => {
	try {
		const orderID = req.params.id
		let data = req.body
		
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
    const transaction = await sequelize.transaction();

    try {
        const order_no = req.params.order_no;
        const data = req.body;

        // Update the order with the provided data
        const [isUpdated] = await OrderModel.update(data, {
            where: { order_no: order_no },
            transaction,
        });

        if (!isUpdated) {
            await transaction.rollback();
            return res.status(202).json({ error: true, message: 'Assign Failed! Try again' });
        }

        // Fetch the updated order details
        const updatedOrder = await OrderModel.findOne({
            where: { order_no: order_no },
            transaction,
        });

        if (!updatedOrder) {
            await transaction.rollback();
            return res.status(202).json({ error: true, message: 'Order not found!' });
        }

        const allot_time_range = updatedOrder.allot_time_range;
        const serProvider = await ServiceProviderModel.findOne({
            where: { name: data.servicep_id },
            transaction,
        });

        if (!serProvider) {
            await transaction.rollback();
            return res.status(202).json({ error: true, message: 'Service Provider not found!' });
        }

        const AllotData = {
            date: updatedOrder.bookdate,
            [allot_time_range]: updatedOrder.service_name,
            emp_id: serProvider.id,
        };

        const existingAvailability = await Availability.findOne({
            where: {
                date: updatedOrder.bookdate,
                emp_id: serProvider.id,
            },
            transaction,
        });

        // Check if the record exists and if the dynamic field already has a value
        if (existingAvailability) {
            if (existingAvailability[allot_time_range]) {
                await transaction.rollback();
                return res.status(202).json({
                    message: 'Already assigned to someone at this time range.',
                });
            } else {
                await existingAvailability.update({
                    [allot_time_range]: updatedOrder.service_name,
                }, { transaction });

                await transaction.commit();
                return res.status(200).json({ status: true, message: 'Availability updated successfully.' });
            }
        } else {
            const newAvailability = await Availability.create(AllotData, { transaction });
            await transaction.commit();
            return res.status(200).json({ message: 'Availability created successfully.' });
        }

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


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
			include: [{
				model: NewCustomerModel,
				attributes: ['name', 'email', 'mobileno'],
				include: {
					model: CustomerModel,
					attributes: ['age', 'address', 'member_id'],
				}
			}],
			where: whereConditions,
			order: [
				['id', 'DESC']
			]
		});

		res.status(200).json({status: 200, data: orders})

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
			include: [{
				model: NewCustomerModel,
				attributes: ['name', 'email', 'mobileno'],
				include: {
					model: CustomerModel,
					attributes: ['age', 'address', 'member_id'],
				}
			}],
			where: {
				servicep_id: isServiceProvider.name,
				pending: status_id
			},
			order: [
				['id', 'DESC']
			]
		});

		res.status(200).json({status: 200, data: orders})

	} catch (error) {
		res.status(200).json("Internal Server Error");
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

const GetTimeSlot = async (req, res) => {
	try {
		const timeSlots = await TimeSlotModel.findAll({
			attributes: ['id', 'time_range']
		})
		res.status(200).json({status: true, data: timeSlots})
	} catch (error) {
		console.error('Error fetching time slots:', error)
		res.status(500).json({ error: "Internal Server Error" })
	}
}

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
	GetOrderAssingwithSupervisor,
	GetTotalSummary,
	GetTimeSlot,
	GetTotalSummary
}
