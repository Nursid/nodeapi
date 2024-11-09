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
const SupervisorAvailability = db.SupervisorAvailability;
const moment = require('moment');

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
			address: formdata.service_address,
			land_mark: formdata.land_mark,
			age: formdata.age,
			mobile: formdata.mobile
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
  
	  formdata.pending = 0;
  
	  const lastOrder = await OrderModel.findOne({
		order: [['id', 'DESC']],
		transaction
	  });
  
	//   formdata.order_no = lastOrder ? parseInt(lastOrder.order_no) + 1 : 1;
	//   formdata.order_no = formdata.order_no.toString().padStart(4, '0');

	  const lastOrderNumber = lastOrder ? parseInt(lastOrder.order_no, 10) : 0;
	  const nextOrderNumber = lastOrderNumber + 1;

	const formattedOrderNumber = nextOrderNumber.toString().padStart(5, '0');
	formdata.order_no = formattedOrderNumber

	  formdata.cust_id = userId;
  
	  if (formdata?.serviceDateTime) {
		const [bookdate, booktime] =  formdata.serviceDateTime.split('T');
		formdata.bookdate = bookdate;
		formdata.booktime = booktime;

		// const currentDate = new Date();
		// const currentDateFormatted = currentDate.toISOString().split('T')[0]; 

		// Ensure bookdate is defined and in the correct format
		// if (bookdate && currentDateFormatted !== bookdate) {
		// 	formdata.pending = 2;
		// }

	  }
  
	  const data = await OrderModel.create(formdata, { transaction });
  
	  if (!data) {
		await transaction.rollback();
		return res.status(202).json({ status: false, message: "Order not placed! Try again" });
	  }
  
	  const allot_time_range = formdata.allot_time_range;

	  if(formdata?.servicep_id){
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
			[allot_time_range]: `${formdata.service_name}-${data.order_no}`,
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
			if (existingAvailability[allot_time_range] === 'p') {
				await existingAvailability.update({
					[allot_time_range]: `${formdata.service_name}-${data.order_no}`,
					}, { transaction });

					if(formdata?.suprvisor_id){
						const serProvider = await EmployeeModel.findOne({
							where: { name: formdata.suprvisor_id },
							transaction
						  });
					  
						  if (!serProvider) {
							await transaction.rollback();
							return res.status(202).json({ status: false, message: 'Supervisor not found!' });
						  }
					  
						  const AllotData = {
							date: formdata.bookdate,
							[allot_time_range]: `${formdata.service_name}-${data.order_no}`,
							emp_id: serProvider.emp_id,
						  };
					  
						  const existingAvailability = await SupervisorAvailability.findOne({
							where: {
							  date: formdata.bookdate,
							  emp_id: serProvider.emp_id,
							},
							transaction
						  });
				
						  // Check if the record exists and if the dynamic field already has a value
						  if (existingAvailability) {
							if (existingAvailability[allot_time_range] === 'p') {
								await existingAvailability.update({
									[allot_time_range]: `${formdata.service_name}-${data.order_no}`,
									}, { transaction });
									await transaction.commit();
									return res.status(200).json({ status: true, message: 'Availability created successfully.'});
								}
								else {
									await transaction.rollback();
									return res.status(202).json({ status: false,
										message: 'Service Provider Not Available',
								});
							} 
						  }
					  }

					await transaction.commit();
					return res.status(200).json({ status: true, message: 'Availability created successfully.'});
				
				}
				else {
					await transaction.rollback();
					return res.status(202).json({ status: false,
					  message: 'Service Provider Not Available',
					});
			} 
		  }
	  }
	  
	//    else {
	// 	await Availability.create(AllotData, { transaction });
		await transaction.commit();
		return res.status(200).json({ status: true, message: 'Availability created successfully.' });
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
					attributes: [ 'user_id','gender', 'age', 'address', 'land_mark', 'location', 'tel_no', 'office_no', 'alternate_no', 'aadhar_no', 'occupation', 'designation', 'own_house', 'dob', 'doa', 'spouse_name', 'spouse_name1', 'spouse_dob1', 'spouse_name2', 'spouse_dob2', 'spouse_dob', 'image','service', 'service1', 'service2', 'service3', 'service4', 'service5', 'username', 'reference', 'familyMember', 'membership', 'is_approved', 'member_id', 'is_block', 'todate', 'validtodate', 'createdAt',
					],
				}
			},
			order: [['bookdate', 'DESC']]
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
					attributes: ['age', 'address', 'member_id', "user_id"],
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
			pending: 3,
		}, {
			where: {
				order_no: order_no,
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
					attributes: [ 'gender', 'age', 'address', 'land_mark', 'location', 'tel_no', 'office_no', 'alternate_no', 'aadhar_no', 'occupation', 'designation', 'own_house', 'dob', 'doa', 'spouse_name', 'spouse_name1', 'spouse_dob1', 'spouse_name2', 'spouse_dob2', 'spouse_dob', 'image','service', 'service1', 'service2', 'service3', 'service4', 'service5', 'username', 'reference', 'familyMember', 'membership', 'is_approved', 'member_id', 'is_block', 'todate', 'validtodate', 'createdAt',
					],
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
const AddOrderCustomer = async (req, res) => {
	try {
	  
	  const formdata = req.body;
  
	  const isCustomer = await NewCustomerModel.findOne({
		where: { mobileno: formdata.mobile },
	  });
  
	  if (!isCustomer) {
		return res.status(201).json({ error: true, message: 'User Not Found!' });
	  }

	  const lastOrder = await OrderModel.findOne({
		order: [['id', 'DESC']]
	  });
  
	  const lastOrderNumber = lastOrder ? parseInt(lastOrder.order_no, 10) : 0;
	  const nextOrderNumber = lastOrderNumber + 1;

	const formattedOrderNumber = nextOrderNumber.toString().padStart(5, '0');
	formdata.order_no = formattedOrderNumber

	  await OrderModel.create(formdata);
  
	  return res.status(200).json({ status: true, message: "Order Created Successfully!" });
	} catch (error) {
	  console.error("Error in AddOrderCustomer:", error);
	  return res.status(500).json({ error: true, message: "Internal Server Error" });
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
            [allot_time_range]: `${updatedOrder.service_name}-${order_no}`,
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
        // if (existingAvailability) {
        //     if (existingAvailability[allot_time_range]) {
        //         await transaction.rollback();
        //         return res.status(202).json({
        //             message: 'Already assigned to someone at this time range.',
        //         });
        //     } else {
        //         await existingAvailability.update({
        //             [allot_time_range]: `${updatedOrder.service_name}-${order_no}`,
        //         }, { transaction });

        //         await transaction.commit();
        //         return res.status(200).json({ status: true, message: 'Availability updated successfully.' });
        //     }
        // } else {
        //     const newAvailability = await Availability.create(AllotData, { transaction });
        //     await transaction.commit();
        //     return res.status(200).json({ message: 'Availability created successfully.' });
        // }


		if (existingAvailability) {
			if (existingAvailability[allot_time_range] === 'p') {
				await existingAvailability.update({
					[allot_time_range]: `${updatedOrder.service_name}-${order_no}`,
					}, { transaction });
				  await transaction.commit();
				  return res.status(200).json({ status: true, message: 'Availability created successfully.' });
				}
				else {
					await transaction.rollback();
					return res.status(202).json({ status: false,
					  message: 'Service Provider Not Available',
					});
			} 
		  }

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const GetOrderAssingServiceProvider = async (req, res) => {
	const serPID = req.params.id
	try {
		const isServiceProvider = await ServiceProviderModel.findOne({
			where: {
				id: serPID
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
				servicep_id: isServiceProvider.name
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
        const [orders, monthlyServices, TotalAcount,TotalExpenses ] = await Promise.all([
            OrderModel.findAll({ where: dateFilter }),
			 MonthlyServiceModel.findAll({
				where: dateFilter,
				attributes: [
				  [Sequelize.fn('DISTINCT', Sequelize.col('orderNo')), 'orderNo']],
			  }),
			AccountModel.findAll({
				attributes: [
					[sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
					[sequelize.fn('SUM', sequelize.literal("CASE WHEN payment_mode = 'Cash' THEN amount ELSE 0 END")), 'total_cash'],
					[sequelize.fn('SUM', sequelize.literal("CASE WHEN payment_mode = 'Online' THEN amount ELSE 0 END")), 'total_online']
				],
				where: {
					type_payment: 0,
					date: {
						[Op.between]: [from, to]
					}
				}
			}),
			AccountModel.findAll({
				attributes: [
					[sequelize.fn('SUM', sequelize.col('amount')), 'total_expense'],
				],
				where: {
					type_payment: 1,
					date: {
						[Op.between]: [from, to]
					}
				}
			})

        ]);

        // Calculating totals
        const totalOrders = parseInt(orders.length)+parseInt(monthlyServices.length);
        const totalCompleted = orders.filter(order => order.pending === 3).length;
        const totalCancel = orders.filter(order => order.pending === 5).length;
        const totalHold = orders.filter(order => order.pending === 1).length;
        const totalPending = orders.filter(order => order.pending === 0).length;
        const totalRunning = orders.filter(order => order.pending === 4).length;
        const totalDue = orders.filter(order => order.pending === 2).length;

        const totalMonthlyService = monthlyServices.length;
        const TotalserviceFees = monthlyServices.reduce((total, service) => total + parseFloat(service.serviceFees), 0);

		const Netbalance = TotalAcount[0]?.dataValues?.total_cash + TotalAcount[0]?.dataValues?.total_online  - TotalExpenses[0]?.dataValues?.total_expense
        
        
        // Constructing summary object
        const summary = {
            totalOrders,
            totalCompleted,
            totalCancel,
            totalHold,
            totalPending,
            totalMonthlyService,
            TotalserviceFees,
            TotalExpenses: TotalExpenses[0]?.dataValues?.total_expense || 0,
			TotalCash: TotalAcount[0]?.dataValues?.total_cash || 0,
			TotalBank: TotalAcount[0]?.dataValues?.total_online || 0,
			totalRunning,
			totalDue,
			Netbalance
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

const GetReports = async (req, res) => {
	const type = parseInt(req.params.type); // Ensure `type` is always an integer
	const today = moment();
	let startDate = "", endDate = "";
	const serviceProvider = req.body?.serviceProvider; // Use `const` instead of `let` since it isn't reassigned
	let where = {};
  
	// Determine date range based on report type
	switch (type) {
	  case 1: // Today
		startDate = today.startOf('day').toDate();
		endDate = new Date();
		where = { bookdate: { [Op.between]: [startDate, endDate] } };
		break;
	  case 3: // This Month
		startDate = today.startOf('month').toDate();
		endDate = new Date();
		where = { bookdate: { [Op.between]: [startDate, endDate] } };
		break;
	  case 6: // Last 6 Months
		startDate = req.body?.from || new Date(0);
		endDate = req.body?.to || new Date();
  
		// Validate that the dates are provided for the last 6 months
		if (!startDate || !endDate) {
		  return res.status(400).json({ error: "Start and end dates are required for the last 6 months." });
		}
  
		where = { 
		  bookdate: { [Op.between]: [startDate, endDate] },
		};
  
		// Add `serviceProvider` to `where` clause only if it's provided
		if (serviceProvider) {
		  where.servicep_id = serviceProvider;
		}
		break;
	  case 7: // This Week
		startDate = today.startOf('week').toDate();
		endDate = new Date();
		where = { bookdate: { [Op.between]: [startDate, endDate] } };
		break;
	  default:
		// Default case covers all other scenarios
		startDate = new Date(0); // Earliest possible date
		endDate = new Date(); // Current date
		where = { bookdate: { [Op.between]: [startDate, endDate] } };
		break;
	}
  
	try {
	  // Fetch orders based on the computed `where` clause
	  const orders = await OrderModel.findAll({
		include: [{
		  model: NewCustomerModel,
		  attributes: ['name', 'email', 'mobileno'],
		  include: {
			model: CustomerModel,
			attributes: ['age', 'address', 'member_id'],
		  }
		}],
		order: [['id', 'DESC']],
		where: where
	  });
  
	  // Return an empty array if no orders are found
	  if (!orders || orders.length === 0) {
		return res.status(200).json({ status: false, data: [] });
	  }
  
	  // Return the found orders
	  res.status(200).json({ status: true, data: orders });
	} catch (error) {
	  console.error("Error fetching reports:", error); // Log the error for debugging
	  res.status(500).json({ error: "Internal Error" }); // Changed to 500 for server errors
	}
};


const GetOrderByOrderNo = async (req, res) => {
	try {
		const order_no = req.params.order_no

		const orders = await OrderModel.findOne({
			attributes: ['pending','service_name'],
			include: {
				model: NewCustomerModel,
				attributes: ['name']
			},
			where: {
				order_no: order_no
			},
		});

		res.status(200).json({status: 200, data: orders})

	} catch (error) {
		return res.status(500).json({status: false, message: "Interal Error"})
	}
}
  

const AddDueBeforeOneday = async (req, res) => {
    try {
        // Get the current date in UTC
        const today = new Date();

        // Convert to Asia/Kolkata time (UTC+5:30)
        
		const options = { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' };
    	const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(today);

        let tomorrow = new Date(formattedDate);
        tomorrow.setDate(tomorrow.getDate() + 1); // Add one day

        // Format the date to YYYY-MM-DD
        tomorrow = tomorrow.toISOString().split('T')[0];
		
        const orders = await OrderModel.findAll({
            attributes: ['pending', 'order_no'],
            where: {
                bookdate: tomorrow,
				pending: {
                    [Op.or]: [0], 
                },
            },
        });

		if (orders.length > 0) {
            // Update each order with pending status 4
            await Promise.all(
                orders.map(order => {
                    return OrderModel.update(
                        { pending: 2 },
                        { where: { order_no: order.order_no } }
                    );
                })
            );

          return  res.status(200).json({ status: 200, message: "Orders updated successfully", data: orders });
        } else {
			return  res.status(200).json({ status: 200, message: "No orders found for tomorrow." });
        }
    } catch (error) {
        return res.status(202).json({ status: false, message: "Internal Error",error });
    }
};


const OrderAssingSupervisor = async (req, res) => {
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

        const allot_time_range = data.time_range;
        const serProvider = await EmployeeModel.findOne({
			attributes: ['emp_id'],
            where: { name: data.suprvisor_id },
			
            transaction,
        });

        if (!serProvider) {
            await transaction.rollback();
            return res.status(202).json({ error: true, message: 'Service Provider not found!' });
        }

        const AllotData = {
            date: data.date,
            [allot_time_range]: `${data.service_name}-${order_no}`,
            emp_id: serProvider.emp_id,
        };

        const existingAvailability = await SupervisorAvailability.findOne({
            where: {
                date: data.date,
                emp_id: serProvider.emp_id,
            },
            transaction,
        });


		if (existingAvailability) {
			if (existingAvailability[allot_time_range] === 'p') {
				await existingAvailability.update({
					[allot_time_range]: `${data.service_name}-${order_no}`,
					}, { transaction });
				  await transaction.commit();
				  return res.status(200).json({ status: true, message: 'Availability created successfully.' });
				}
				else {
					await transaction.rollback();
					return res.status(202).json({ status: false,
					  message: 'Service Provider Not Available',
					});
			} 
		  }

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


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
	GetTotalSummary,
	GetOrderAssingServiceProvider,
	AddOrderCustomer,
	AddOrderCustomer,
	GetReports,
	GetOrderByOrderNo,
	AddDueBeforeOneday,
	OrderAssingSupervisor
}
