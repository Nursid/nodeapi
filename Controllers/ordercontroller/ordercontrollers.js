const generateOrderNo = require("../misc/orderNoGenerator");
const Sequelize = require('sequelize');
const sequelize = require('../../config/sequalize'); 
const Op = Sequelize.Op;
const db = require("../../model/index");
const CustomerModel = db.CustomerModel
const OrderModel = db.OrderModel
const OrderServiceProviders = db.OrderServiceProviders
const NewCustomerModel = db.NewCustomerModel
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
const MonthlyServiceModel = db.MonthlyServiceModel
const AccountModel = db.Account
const TimeSlotModel = db.TimeSlotModel
const Availability = db.Availability
const SupervisorAvailability = db.SupervisorAvailability;
const moment = require('moment');
const axios = require('axios');
const AvailabilityModel = db.Availability


const AllTimeSlots = [ 
    '07:00-07:30', '07:30-08:00', '08:00-08:30', '08:30-09:00', '09:00-09:30',
    '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
    '12:00-12:30', '12:30-01:00', '01:00-01:30', '01:30-02:00', '02:00-02:30',
    '02:30-03:00', '03:00-03:30', '03:30-04:00', '04:00-04:30', '04:30-05:00',
    '05:00-05:30', '05:30-06:00'
];

function getTimeInMinutes(time) {
    let [hours, minutes] = time.split(':').map(Number);
    
    // Adjust for 12-hour to 24-hour format
    if (hours === 12) {
        hours = 0; // 12 PM is noon, treated as 0
    }
    if (hours < 7 || time.includes('01') || time.includes('02') || time.includes('03') || time.includes('04') || time.includes('05') || time.includes('06')) {
        hours += 12; // Adjust PM times from 1:00 to 6:00
    }

    return hours * 60 + minutes;
}

function filterTimeSlots(inputTime) {
    const inputMinutes = getTimeInMinutes(inputTime);

    return AllTimeSlots.filter(slot => {
        const [start] = slot.split('-');
        const startMinutes = getTimeInMinutes(start);
        return startMinutes > inputMinutes;
    });
}


function getCurrentTimeSlot() {
    const now = new Date();
    // const hours = now.getHours();
    // const minutes = now.getMinutes();
    const hours = 9
    const minutes = 20
    
    const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    for (let slot of AllTimeSlots) {
        const [start, end] = slot.split('-');
        if (currentTime >= start && currentTime < end) {
            return slot;
        }
    }
    return null; // No matching slot found
}

function getPreviousTimeSlot() {

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // const hours = 9
    // const minutes = 20

    const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    let previousSlots = [];
    
    for (let slot of AllTimeSlots) {
        const [start, end] = slot.split('-');
        if (currentTime >= end) {
            previousSlots.push(slot);
        } else {
            break; // Stop once we reach the current or future slot
        }
    }

    return previousSlots;
}

async function calculateSlots(allot_time_range, approx_duration) {
    // Find the index of the starting time range
    const startIndex = AllTimeSlots.indexOf(allot_time_range);
    
    // If the starting range is not found, return an empty array
    if (startIndex === -1) {
        return [];
    }

    // Calculate the number of slots needed (each slot is 30 minutes)
    const slotsNeeded = approx_duration * 2;

    // Slice the array to get the required slots
    const result = AllTimeSlots.slice(startIndex, startIndex + slotsNeeded);

    return result;
}



const getServiceProviderIds = async (serviceProviderNames) => {
    // Fetch all service providers in one query
    const serviceProviders = await ServiceProviderModel.findAll({
        where: {
            name: serviceProviderNames
        },
        attributes: ['id', 'name']
    });

    // Map service provider names to their IDs
    return serviceProviders
};


const GetOrderNow = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { servicep_providers, ...formdata } = req.body;
        
        // Step 1: Check if user exists and create if necessary
        const userId = await getOrCreateUser(formdata, transaction);
        
        // Step 2: Generate order number
        const orderNumber = await generateOrderNumber(transaction);
        
        // Step 3: Create order
        const order = await createOrder(formdata, userId, orderNumber, transaction);
        
        // Step 4: Handle service providers
        await handleServiceProviders(servicep_providers, order, formdata, transaction);
        
        // Step 5: Handle supervisor
        await handleSupervisor(formdata, order, transaction);

        await transaction.commit();
        return res.status(200).json({ status: true, message: 'Order created successfully.' });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ error: true, message: error.message });
    }
};

async function getOrCreateUser(formdata, transaction) {
    let user = await NewCustomerModel.findOne({
        where: { mobileno: formdata.mobile },
        transaction
    });

    if (!user) {
        user = await NewCustomerModel.create(
            {
                name: formdata.name,
                email: formdata.email,
                mobileno: formdata.mobile,
                ismember: false
            },
            { transaction }
        );

        await CustomerModel.create(
            {
                user_id: user.id,
                address: formdata.service_address,
                land_mark: formdata.land_mark,
                age: formdata.age,
                mobile: formdata.mobile
            },
            { transaction }
        );
    }

    return user.id;
}

async function generateOrderNumber(transaction) {
    const lastOrder = await OrderModel.findOne({
        order: [['id', 'DESC']],
        transaction
    });

    const lastOrderNumber = lastOrder ? parseInt(lastOrder.order_no, 10) : 0;
    return (lastOrderNumber + 1).toString().padStart(5, '0');
}

async function createOrder(formdata, userId, orderNumber, transaction) {
    formdata.pending = 0;
    formdata.order_no = orderNumber;
    formdata.cust_id = userId;

    if (formdata.serviceDateTime) {
        const [bookdate, booktime] = formdata.serviceDateTime.split('T');
        formdata.bookdate = bookdate;
        formdata.booktime = booktime;
    }

    const order = await OrderModel.create(formdata, { transaction });
    if (!order) {
        throw new Error("Order not placed! Try again");
    }
    return order;
}

async function handleServiceProviders(servicep_providers, order, formdata, transaction) {
    if (!servicep_providers || !Array.isArray(servicep_providers)) return;

    const slots = await calculateSlots(formdata.allot_time_range, formdata.approx_duration);
    const updatedSlots = slots.reduce((acc, slot) => {
        acc[slot] = `${formdata.service_name}-${order.order_no}`;
        return acc;
    }, {});

    await Promise.all(servicep_providers.map(async (providerId) => {
        await OrderServiceProviders.create(
            { order_no: order.order_no, service_provider_id: providerId },
            { transaction }
        );

        const existingAvailability = await Availability.findOne({
            where: { date: formdata.bookdate, emp_id: providerId },
            transaction
        });

        if (existingAvailability) {
            if (existingAvailability[formdata.allot_time_range] === 'p') {
                await existingAvailability.update(updatedSlots, { transaction });
            } else {
                throw new Error('Service Provider Not Available');
            }
        }
    }));
}

async function handleSupervisor(formdata, order, transaction) {
    if (!formdata.suprvisor_id) return;

    const supervisor = await EmployeeModel.findOne({
        where: { name: formdata.suprvisor_id },
        transaction
    });

    if (!supervisor) {
        throw new Error('Supervisor not found!');
    }

    const existingAvailability = await SupervisorAvailability.findOne({
        where: { date: formdata.bookdate, emp_id: supervisor.emp_id },
        transaction
    });

    if (existingAvailability) {
        if (existingAvailability[formdata.allot_time_range] === 'p') {
            await existingAvailability.update(
                { [formdata.allot_time_range]: `${formdata.service_name}-${order.order_no}` },
                { transaction }
            );
        } else {
            throw new Error('Supervisor Not Available');
        }
    }
}

const getServiceProviderStatus = async (orders, empIds) => {
    const result = empIds.map((emp) => {
        for (const order of orders) {
            const serviceProvider = order.orderserviceprovider.find(
                (sp) => sp.service_provider_id === emp.id
            );

            if (serviceProvider) {
                if (order.checkouttime === null) {
                    return {
                        name: emp.name.trim(),
                        checkintime: order.checkintime,
                        order_no: order.order_no,
                    };
                } 
            }
        }
    });

    // Filter out null and undefined values from result array
    const nonNullResults = result.filter((entry) => entry !== null && entry !== undefined);

    // Check if all values in the result array are null or undefined
    if (nonNullResults.length === 0) {
        return false;
    }
    // Return non-null and non-undefined results
    return nonNullResults;
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
    const transaction = await sequelize.transaction();
    try {
        const orderID = req.params.id;
        
        const { servicep_providers, ...updateData } = req.body;

        // Step 1: Find and update the order
        const order = await OrderModel.findOne({
            where: { order_no: orderID },
            transaction
        });

        if (!order) {
            await transaction.rollback();
            return res.status(202).json({ error: true, message: 'Order not found' });
        }

        await order.update(updateData, { transaction });

        // Step 2: Update service providers if provided
        if (servicep_providers && Array.isArray(servicep_providers)) {

            const slots = await calculateSlots(updateData.allot_time_range, updateData.approx_duration);
            const updatedSlots = slots.reduce((acc, slot) => {
                acc[slot] = `${updateData.service_name}-${order.order_no}`;
                return acc;
            }, {});
            // Remove existing service providers
            await OrderServiceProviders.destroy({
                where: { order_no: orderID },
                transaction
            });

            // Add new service providers
            const serviceProviderPromises = servicep_providers.map(async (providerId) => {
                // Check if the service provider exists
                const serviceProvider = await ServiceProviderModel.findOne({
                    where: { id: providerId },
                    transaction
                });

                if (!serviceProvider) { 
                    await transaction.rollback();
                    return  res.status(202).json({ status: 202, message: `Service Provider with ID ${providerId} not found` });
                }

                // Add the service provider to the order
                await OrderServiceProviders.create(
                    { order_no: orderID, service_provider_id: providerId },
                    { transaction }
                );

                const existingAvailability = await Availability.findOne({
                    where: { date: updateData.bookdate, emp_id: providerId },
                    transaction
                });
        
                if (existingAvailability) {
                    if (existingAvailability[updateData.allot_time_range]) {
                        // Update the existing availability record with new slots
                        await existingAvailability.update(updatedSlots, { transaction });
                    } else {
                        throw new Error('Service Provider Not Available');
                    }
                } else {
                    // If availability record doesn't exist, create a new one
                    await Availability.create(
                        {
                            date: updateData.bookdate,
                            emp_id: providerId,
                            ...updatedSlots
                        },
                        { transaction }
                    );
                }
            });

            await Promise.all(serviceProviderPromises);
        }


        // Step 3: Handle supervisor if provided
        if (updateData.suprvisor_id) {
            const supervisor = await EmployeeModel.findOne({
                where: { name: updateData.suprvisor_id },
                transaction
            });

            if (!supervisor) {
                await transaction.rollback();
                return  res.status(202).json({ status: 202, message: "Supervisor not found!" });
            }

            const existingAvailability = await SupervisorAvailability.findOne({
                where: { date: updateData.bookdate, emp_id: supervisor.emp_id },
                transaction
            });

            if (existingAvailability && existingAvailability[updateData.allot_time_range]) {
                await existingAvailability.update(
                    { [updateData.allot_time_range]: `${updateData.service_name}-${orderID}` },
                    { transaction }
                );
            } else {
                await SupervisorAvailability.create(
                    { date: updateData.bookdate, emp_id: supervisor.emp_id, [updateData.allot_time_range]: `${updateData.service_name}-${orderID}` },
                    { transaction }
                );
            }
        }

        // Commit transaction
        await transaction.commit();
        res.status(200).json({ status: 200, message: "Update Successful!" });
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }
        res.status(500).json({ error: true, message: error.message });
    }
};


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
            include: [
                {
                    model: NewCustomerModel,
                    attributes: ['name', 'email', 'mobileno'],
                    include: {
                        model: CustomerModel,
                        attributes: [
                            'user_id', 'gender', 'age', 'address', 'land_mark',
                            'location', 'tel_no', 'office_no', 'alternate_no',
                            'aadhar_no', 'occupation', 'designation', 'own_house',
                            'dob', 'doa', 'spouse_name', 'spouse_name1',
                            'spouse_dob1', 'spouse_name2', 'spouse_dob2',
                            'spouse_dob', 'image', 'service', 'service1',
                            'service2', 'service3', 'service4', 'service5',
                            'username', 'reference', 'familyMember', 'membership',
                            'is_approved', 'member_id', 'is_block', 'todate',
                            'validtodate', 'createdAt',
                        ],
                    },
                },
                {
                    model: OrderServiceProviders,
					include:{
						model: ServiceProviderModel,
						attributes: ['name']
					}
                },
            ],
            order: [['bookdate', 'DESC']],
        });

        // Check if orders exist
        if (!orders || orders.length === 0) {
            return res.status(404).json({ status: 404, message: "No orders found." });
        }

        // Group orders by order_no
        const groupedOrders = orders.reduce((acc, current) => {
            const orderNo = current.order_no;

            if (!acc[orderNo]) {
                acc[orderNo] = {
                    ...current.dataValues,
                    orderserviceprovider: [current.orderserviceprovider], // Initialize as an array
                };
            } else {
                // If the order_no already exists, merge orderserviceprovider
                acc[orderNo].orderserviceprovider.push(current.orderserviceprovider);
            }

            return acc;
        }, {});

        // Convert grouped object to array
        const response = Object.values(groupedOrders);

        // Respond with grouped orders data
        res.status(200).json({ status: 200, data: response });
    } catch (error) {
        console.error("Error in GetAllOrders:", error.message);
        res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
};


const GetByStatus = async (req, res) => {
	const status = req.params.status
	try {
	
		const orders = await OrderModel.findAll({
			include: [{
				model: NewCustomerModel,
				attributes: ['name', 'email', 'mobileno'],
				include: {
					model: CustomerModel,
					attributes: ['age', 'address', 'member_id', "user_id"],
				},
				
			},
			{
				model: OrderServiceProviders,
					include:{
						model: ServiceProviderModel,
						attributes: ['name']
					}
				},
			],
			
			order: [['id', 'DESC']],
			where: {
				pending: status
			}
		});

		 // Check if orders exist
		 if (!orders || orders.length === 0) {
            return res.status(200).json({ status: 200, data: [] });
        }

        // Group orders by order_no
        const groupedOrders = orders.reduce((acc, current) => {
            const orderNo = current.order_no;

            if (!acc[orderNo]) {
                acc[orderNo] = {
                    ...current.dataValues,
                    orderserviceprovider: [current.orderserviceprovider], // Initialize as an array
                };
            } else {
                // If the order_no already exists, merge orderserviceprovider
                acc[orderNo].orderserviceprovider.push(current.orderserviceprovider);
            }

            return acc;
        }, {});

        // Convert grouped object to array
        const response = Object.values(groupedOrders);

        // Respond with grouped orders data
        res.status(200).json({ status: 200, data: response });
		
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
			include: [
				{
					model: NewCustomerModel,
					attributes: ['name', 'email', 'mobileno'],
					include: [
						{
							model: CustomerModel,
							attributes: ['age', 'address', 'member_id', 'user_id'],
						},
					],
				},
				{
					model: OrderServiceProviders,
					include:{
						model: ServiceProviderModel,
						attributes: ['name']
					},
					where: {
						service_provider_id: serPID,
					},
				},
			],
			order: [['id', 'DESC']],
		});

		const groupedOrders = orders.reduce((acc, current) => {
            const orderNo = current.order_no;

            if (!acc[orderNo]) {
                acc[orderNo] = {
                    ...current.dataValues,
                    orderserviceprovider: [current.orderserviceprovider], // Initialize as an array
                };
            } else {
                // If the order_no already exists, merge orderserviceprovider
                acc[orderNo].orderserviceprovider.push(current.orderserviceprovider);
            }

            return acc;
        }, {});

        // Convert grouped object to array
        const response = Object.values(groupedOrders);
		

		res.status(200).json({status: 200, data: response})

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
			},
			{
				model: OrderServiceProviders,
				include:{
					model: ServiceProviderModel,
					attributes: ['name']
				}
			},
		],
			where: whereConditions,
			order: [
				['id', 'DESC']
			]
		});


		const groupedOrders = orders.reduce((acc, current) => {
            const orderNo = current.order_no;

            if (!acc[orderNo]) {
                acc[orderNo] = {
                    ...current.dataValues,
                    orderserviceprovider: [current.orderserviceprovider], // Initialize as an array
                };
            } else {
                // If the order_no already exists, merge orderserviceprovider
                acc[orderNo].orderserviceprovider.push(current.orderserviceprovider);
            }

            return acc;
        }, {});

        // Convert grouped object to array
        const response = Object.values(groupedOrders);
		

		res.status(200).json({status: 200, data: response})

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
	const serviceProvider = req.body?.serviceProvider; 
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
		},
		{
			model: OrderServiceProviders,
			include:{
				model: ServiceProviderModel,
				attributes: ['name']
			}
		}
	],
		order: [['id', 'DESC']],
		where: where
	  });
	  
		const groupedOrders = orders.reduce((acc, current) => {
            const orderNo = current.order_no;

            if (!acc[orderNo]) {
                acc[orderNo] = {
                    ...current.dataValues,
                    orderserviceprovider: [current.orderserviceprovider], // Initialize as an array
                };
            } else {
                // If the order_no already exists, merge orderserviceprovider
                acc[orderNo].orderserviceprovider.push(current.orderserviceprovider);
            }

            return acc;
        }, {});

        // Convert grouped object to array
        const response = Object.values(groupedOrders);
  
	  // Return an empty array if no orders are found
	  if (!response || response.length === 0) {
		return res.status(200).json({ status: false, data: [] });
	  }
  
	  // Return the found orders
	  res.status(200).json({ status: true, data: response });
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
		
        const tomorrowOrders = await OrderModel.findAll({
            attributes: ['pending', 'order_no'],
            where: {
                bookdate: tomorrow,
				pending: {
                    [Op.or]: [0], 
                },
            },
        });


        // Update tomorrow's orders
        if (tomorrowOrders.length > 0) {
            await Promise.all(
                tomorrowOrders.map(order => {
                    return OrderModel.update(
                        { pending: 2 },
                        { where: { order_no: order.order_no } }
                    );
                })
            );
        }

		    // Calculate yesterday
		let yesterday = new Date(formattedDate);
		yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
		yesterday = yesterday.toISOString().split('T')[0]; // Format as YYYY-MM-DD
	

		 // Find orders in due before yesterday
		 const pastDueOrders = await OrderModel.findAll({
            attributes: ['pending', 'order_no'],
            where: {
                bookdate: {
                    [Op.lt]: yesterday, // Less than yesterday's date
                },
                pending: 2
            },
        });

		// Update past due orders
		if (pastDueOrders.length > 0) {
			await Promise.all(
				pastDueOrders.map(order => {
					return OrderModel.update(
						{ pending: 0 },
						{ where: { order_no: order.order_no } }
					);
				})
			);
		}

	// Construct response message
	const messages = [];
	if (tomorrowOrders.length > 0) {
		messages.push(`${tomorrowOrders.length} orders updated for tomorrow.`);
	}
	if (pastDueOrders.length > 0) {
		messages.push(`${pastDueOrders.length} past due orders updated.`);
	}

	if (messages.length > 0) {
		return res.status(200).json({ status: 200, message: messages.join(' '), data: { tomorrowOrders, pastDueOrders } });
	} else {
		return res.status(200).json({ status: 200, message: "No orders found to update." });
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

const GetOrderReports = async (req, res) => {
	const date = req.body.date;
	const serviceProvider = req.body?.serviceProvider; 
	let where = {};
  
	// Determine date range based on report typ
	if(date){
		where.bookdate = date
	}

	// Add `serviceProvider` to `where` clause only if it's provided
	if (serviceProvider) {
		where.servicep_id = serviceProvider;
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
		},
		{
			model: OrderServiceProviders,
			include:{
				model: ServiceProviderModel,
				attributes: ['name']
			}
		}
	],
		order: [['id', 'DESC']],
		where: where
	  });
	  
		const groupedOrders = orders.reduce((acc, current) => {
            const orderNo = current.order_no;

            if (!acc[orderNo]) {
                acc[orderNo] = {
                    ...current.dataValues,
                    orderserviceprovider: [current.orderserviceprovider], // Initialize as an array
                };
            } else {
                // If the order_no already exists, merge orderserviceprovider
                acc[orderNo].orderserviceprovider.push(current.orderserviceprovider);
            }

            return acc;
        }, {});

        // Convert grouped object to array
        const response = Object.values(groupedOrders);
  
	  // Return an empty array if no orders are found
	  if (!response || response.length === 0) {
		return res.status(200).json({ status: false, data: [] });
	  }
  
	  // Return the found orders
	  res.status(200).json({ status: true, data: response });
	} catch (error) {
	  console.error("Error fetching reports:", error); // Log the error for debugging
	  res.status(500).json({ error: "Internal Error" }); // Changed to 500 for server errors
	}
};
const OrderCheckIn = async (req, res) => {
    const transaction = await sequelize.transaction(); // Start a transaction

    try {
        let data = req.body;
        if (!data?.order_no) {
            return res.status(400).json({ error: true, message: 'Order No is required' });
        }
        data.pending = 4;

        let date = new Date();
        let currentDate = date.toISOString().split('T')[0]; 
        
        const orders = await OrderModel.findAll({
            attributes: ['order_no', 'pending', 'bookdate', 'suprvisor_id' ],
            include: [{ model: OrderServiceProviders }],
            where: { order_no: data.order_no }
        });

        // Group orders by order_no
        const groupedOrders = orders.reduce((acc, current) => {
            const orderNo = current.order_no;
            if (!acc[orderNo]) {
                acc[orderNo] = { 
                    ...current.dataValues, 
                    orderserviceprovider: [current.orderserviceprovider] 
                };
            } else {
                acc[orderNo].orderserviceprovider.push(current.orderserviceprovider);
            }
            return acc;
        }, {});

        const response = Object.values(groupedOrders);

        if (response.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ error: true, message: "Order not found" });
        }

        const orderDetails = response[0]; // Access first object

        if (orderDetails.bookdate !== currentDate) {
            await transaction.rollback();
            return res.status(202).json({ status: false, message: "Invalid Date To Check-In" });
        }

        if (!orderDetails.suprvisor_id) {
            await transaction.rollback();
            return res.status(202).json({ error: true, message: 'Supervisor not Assigned' });
        }

        if (!orderDetails.orderserviceprovider || orderDetails.orderserviceprovider.length === 0) {
            await transaction.rollback();
            return res.status(202).json({ error: true, message: 'Service Provider not Assigned' });
        }

        const serviceProviderNames = data.serviceProvider.split(',').map(name => name.trim());
        const empIds = await getServiceProviderIds(serviceProviderNames);

        const allOrders = await Promise.all(
            empIds.map(async ({ id, name }) => {
                const orders = await OrderModel.findAll({
                    include: {
                        model: OrderServiceProviders,
                        include: { model: ServiceProviderModel, attributes: ['id', 'name'] },
                        where: { service_provider_id: id },
                    },
                    attributes: ['order_no', 'bookdate', 'checkintime', 'checkouttime'],
                    where: { bookdate: currentDate, pending: 4 }
                });
        
                const pendingCheckouts = orders
                    .filter(order => order.checkouttime === null)
                    .map(order => `${name} service provider has not checked out from order ${order.order_no}. Please check out first.`);
        
                return {
                    serviceProvider: name,
                    orders,
                    messages: pendingCheckouts
                };
            })
        );
        
        // Flatten messages and filter out empty ones
        const pendingMessages = allOrders.flatMap(order => order.messages).filter(msg => msg.length > 0);
        
        // If there are pending checkouts, concatenate names and return message
        if (pendingMessages.length > 0) {
            const names = allOrders
                .filter(order => order.messages.length > 0)
                .map(order => order.serviceProvider)
                .join(', ');
        
            await transaction.rollback();
            return res.status(202).json({
                error: true,
                // message: `The following service providers have not checked out: ${names}. Please check out first.`,
                message: pendingMessages
            });
        }

        const isUpdated = await OrderModel.update(
            { pending: 4, checkintime: data.checkintime },
            { where: { order_no: data.order_no }, transaction }
        );

        if (!isUpdated || isUpdated[0] === 0) {
            await transaction.rollback();
            return res.status(202).json({ error: true, message: 'Update Failed! Try again' });
        }

        await transaction.commit();
        res.status(200).json({ status: true, message: "Availability Check-In Successfully!", response });

    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }

        console.error("Error in OrderCheckIn:", error.message || error);
        res.status(500).json({ error: true, message: "Internal Server Error", details: error.message || error });
    }
};



const OrderCheckOut = async (req, res) => {
    const transaction = await sequelize.transaction(); // Start a transaction

    try {
        let data = req.body;
        if (!data?.order_no) {
            return res.status(400).json({ error: true, message: 'Order No is required' });
        }

        let date = new Date();
        let kolkataTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false });
        let timeParts = kolkataTime.split(', ')[1].split(':');

		let hours = parseInt(timeParts[0]);
		let minutes = parseInt(timeParts[1]);
  
		// let hours = 7
		// let minutes = 40
	
		// Check if the time is between 6:00 PM and 6:00 AM
		let isAfterSixPM = (hours >= 18); // 6 PM is 18 in 24-hour format
		let isBeforeSixAM = (hours < 7); // 6 AM is less than 6 in 24-hour format
  
		if (isAfterSixPM || isBeforeSixAM) {
			return  res.status(202).json({status: false, message: "Invailid Time To Check In" });
		}
  
        // let formattedTime = `${timeParts[0]}:${timeParts[1]}`;

        // const options = { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' };
        // const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(date);

        // let leaveSlots = filterTimeSlots(formattedTime);

        // const serviceProviderNames = data.serviceProvider.split(',').map(name => name.trim());

        // const empId = await getServiceProviderIds(serviceProviderNames);

        const isUpdated = await OrderModel.update(data, {
            where: {
                order_no: data.order_no
            },
            transaction // Pass the transaction to ensure it's part of the same transaction
        });

        if (!isUpdated) {
			await transaction.rollback();
            return res.status(202).json({ error: true, message: 'Updation Failed ! Try again' });
        }

        // for (let serviceProviderId of empId) {
        //     let existingRecords = await AvailabilityModel.findOne({
        //         where: { date: formattedDate, emp_id: serviceProviderId },
        //         raw: true,
        //         transaction // Pass the transaction
        //     });

        //     let updatedSlots = {};
        //     leaveSlots.forEach(slot => {
        //         updatedSlots[slot] = 'p';
        //     });

        //     if (existingRecords) {
        //         await AvailabilityModel.update(updatedSlots, {
        //             where: { date: formattedDate, emp_id: serviceProviderId },
        //             transaction // Pass the transaction
        //         });
        //     } else {
        //         await AvailabilityModel.create({
        //             date: formattedDate,
        //             emp_id: serviceProviderId,
        //             ...updatedSlots
        //         }, { transaction }); // Pass the transaction
        //     }
        // }

        // If everything succeeds, commit the transaction
        await transaction.commit();

        res.status(200).json({ status: true, message: "Availability CheckOut Successfully!" });

    } catch (error) {
        // If an error occurs, rollback the transaction
        await transaction.rollback();

        console.log("--", error);
        res.status(500).json({ error: true, message: "Internal Server Error", error });
    }
};

const AssignServiceProviderAvailability = async (req, res) => {
    const transaction = await sequelize.transaction(); // Start a transaction

    try {
        let data = req.body;

        // Check for required fields
        if (!data?.order_no) {
            return res.status(400).json({ error: true, message: 'Order No is required' });
        }

        if (!data?.serviceProvider) {
            return res.status(400).json({ error: true, message: 'Service Providers are required' });
        }

        if (!data?.bookdate) {
            return res.status(400).json({ error: true, message: 'Booking date is required' });
        }

        if (!data?.allot_time_range) {
            return res.status(400).json({ error: true, message: 'Allot time range is required' });
        }

        const servicep_providers = data.serviceProvider;

        // Validate service providers
        if (servicep_providers.length === 0) {
            return res.status(400).json({ error: true, message: 'At least one service provider is required' });
        }

        // Get service provider IDs
        const empId = await getServiceProviderIds(servicep_providers);
        if (!empId || !Array.isArray(empId)) {
            return res.status(400).json({ error: true, message: 'Invalid service provider data' });
        }

        const orderServiceProvidersPromises = empId.map(async (providerId) => {
            try {
                // Insert order-service provider mapping
                await OrderServiceProviders.create(
                    { order_no: data.order_no, service_provider_id: providerId },
                    { transaction }
                );

                // Check for existing availability
                const existingAvailability = await Availability.findOne({
                    where: { date: data.bookdate, emp_id: providerId },
                    transaction
                });

                if (existingAvailability) {
                    // Update availability
                    await existingAvailability.update(
                        { [data.allot_time_range]: `${data.service_name}-${data.order_no}` },
                        { transaction }
                    );
                } else {
                    // Create new availability entry
                    await AvailabilityModel.create({
                        date: data.bookdate,
                        emp_id: providerId,
                        [data.allot_time_range]: `${data.service_name}-${data.order_no}`
                    }, { transaction });
                }

            } catch (err) {
                console.error(`Error processing providerId ${providerId}:`, err);
                throw new Error(`Error processing provider ID: ${providerId}`);
            }
        });

        await Promise.all(orderServiceProvidersPromises);

        // Commit the transaction
        await transaction.commit();

        res.status(200).json({ status: true, message: "Service Provider Assigned Successfully!" });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();

        console.error("Error in AssignServiceProviderAvailability:", error);

        res.status(500).json({ error: true, message: "Internal Server Error", error: error.message });
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
	OrderCheckOut,
	GetTotalSummary,
	GetOrderAssingServiceProvider,
	AddOrderCustomer,
	AddOrderCustomer,
	GetReports,
	GetOrderByOrderNo,
	AddDueBeforeOneday,
	OrderAssingSupervisor,
	GetOrderReports,
	OrderCheckIn,
	AssignServiceProviderAvailability
}
