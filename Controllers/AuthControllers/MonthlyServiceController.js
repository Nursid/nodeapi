const db = require("../../model/index");
const MonthlyServiceModel = db.MonthlyServiceModel
const CustomerModel = db.NewCustomerModel;
const AvailabilityModel = db.Availability;
const SupervisorAvailability = db.SupervisorAvailability
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
const sequelize = require('../../config/sequalize');

const AddMonthlyService = async (req, res) => {
    const transaction = await sequelize.transaction();
    const data = req.body;

    try {
        // Handle file uploads
        if (req.files) {
            const { before_cleaning, after_cleaning } = req.files;
            data.before_cleaning = before_cleaning?.[0]?.filename || null;
            data.after_cleaning = after_cleaning?.[0]?.filename || null;
        }

        // Fetch customer ID
        const user = await CustomerModel.findOne({ where: { mobileno: data.mobile_no } });
        if (!user) return res.status(201).json({ status: false, message: "This Customer does not exist" });

        data.user_id = user.id;

        const { 
            serviceServeType, 
            feesPaidDateTime, 
            service_provider, 
            serviceType, 
            selectedTimeSlot, 
            supervisor 
        } = data;

        const selectedTimeSlots = selectedTimeSlot.split(',').map(item => item.trim());
        const providerNames = service_provider.split(',').map(item => item.trim());

        // Fetch service provider IDs
        const serviceProviderIds = await Promise.all(
            providerNames.map(async name => {
                const provider = await ServiceProviderModel.findOne({ where: { name } });
                return provider?.id || null;
            })
        );

        const validProviderIds = serviceProviderIds.filter(Boolean);
        if (validProviderIds.length === 0) {
            return res.status(201).json({ status: false, message: "This Service Provider does not exist" });
        }

        // Fetch supervisor data
        const supervisorData = await EmployeeModel.findOne({ where: { name: supervisor } });

        if (!supervisorData) {
            return res.status(201).json({ status: false, message: "Supervisor does not exist" });
        }

        if (["Weekly", "Daily", "Alternative"].includes(serviceServeType)) {
            const availabilityEntries = [];
            const supervisorEntries = [];
            const monthlyEntries = [];

            const [date] = feesPaidDateTime.split('T');
            const [year, month, day] = date.split('-');
            const currentDate = new Date(year, month - 1, day);

            const incrementDays = {
                Weekly: 7,
                Alternative: 2,
                Daily: 1
            }[serviceServeType] || 0;

            const orderNumber = await getNextOrderNumber();

            for (let i = 0; i < 30; i += incrementDays) {
                const formattedDate = currentDate.toISOString().split('T')[0];

                validProviderIds.forEach(servicepId => {
                    selectedTimeSlots.forEach(slot => {
                        availabilityEntries.push({
                            emp_id: servicepId,
                            date: formattedDate,
                            [slot]: `${serviceType}-MonthlyService-${data.cust_name}-${orderNumber}`
                        });
                    });
                });

                selectedTimeSlots.forEach(slot => {
                    supervisorEntries.push({
                        emp_id: supervisorData.emp_id,
                        date: formattedDate,
                        [slot]: `${serviceType}-MonthlyService-${data.cust_name}-${orderNumber}`
                    });
                });

                monthlyEntries.push({
                    ...data,
                    feesPaidDateTime: formattedDate,
                    orderNo: orderNumber,
                    pending: 0
                });

                currentDate.setDate(currentDate.getDate() + incrementDays);
            }


			const mergedServiceProviderEntries = availabilityEntries.reduce((acc, curr) => {
				const { emp_id, date, ...slots } = curr;
			  
				// Check if an entry for the same emp_id and date already exists
				const existingEntry = acc.find(
				  (entry) => entry.emp_id === emp_id && entry.date === date
				);
			  
				if (existingEntry) {
				  // Merge the slot data into the existing entry
				  Object.assign(existingEntry, slots);
				} else {
				  // Add a new entry to the result array
				  acc.push({ emp_id, date, ...slots });
				}
			  
				return acc;
			  }, []);

			const mergedSupervisorEntries = supervisorEntries.reduce((acc, curr) => {
			const { emp_id, date, ...slots } = curr;
			
			// Check if an entry for the same emp_id and date already exists
			const existingEntry = acc.find(
				(entry) => entry.emp_id === emp_id && entry.date === date
			);
			
			if (existingEntry) {
				// Merge the slot data into the existing entry
				Object.assign(existingEntry, slots);
			} else {
				// Add a new entry to the result array
				acc.push({ emp_id, date, ...slots });
			}
			
			return acc;
			}, []);
			  

            // // Bulk create or update availability entries
            await Promise.all(
                mergedServiceProviderEntries.map(async entry => {
                    const existing = await AvailabilityModel.findOne({
                        where: { emp_id: entry.emp_id, date: entry.date },
                        transaction
                    });

                    if (existing) {
                        await existing.update(entry, { transaction });
                    } else {
                        await AvailabilityModel.create(entry, { transaction });
                    }
                })
            );

            await Promise.all(
                mergedSupervisorEntries.map(async entry => {
                    const existing = await SupervisorAvailability.findOne({
                        where: { emp_id: entry.emp_id, date: entry.date },
                        transaction
                    });

                    if (existing) {
                        await existing.update(entry, { transaction });
                    } else {
                        await SupervisorAvailability.create(entry, { transaction });
                    }
                })
            );

            // // Bulk insert monthly service entries
            await MonthlyServiceModel.bulkCreate(monthlyEntries, { transaction });
            await transaction.commit();

            return res.status(200).json({ status: true, message: 'Monthly Service Added!', orderNo: orderNumber });
        }
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return res.status(500).json({ status: false, message: "Internal Server Error", error });
    }
};

const GetAllMonthlyService = async (req, res) => {
    try {
        let date;
        const dateParam = req.query.date;
        // Check if dateParam is defined and not null, and also not the string "undefined"
        if (dateParam !== undefined && dateParam !== null && dateParam !== "undefined") {
            date = new Date(dateParam);  
        } else {
            date = new Date();  // Use the current date if dateParam is invalid
        }

        // Format the date as 'YYYY-MM-DD'
        const currentDate = date.toISOString().split('T')[0];

        // Query the database with the formatted date
        const data = await MonthlyServiceModel.findAll({
            where: {
                feesPaidDateTime: currentDate
            }
        });

        if (data.length > 0) {
            return res.status(200).json({ status: 200, data });
        } else {
            return res.status(200).json({ status: 200, data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};


const DeleteMonthlyService = async (req, res) => {
	const id = req.params.id
	try {

		const data = await MonthlyServiceModel.destroy({
			where: {
				id: id
			}
		});

		if (data) {
			return res.status(200).json({status: 200, data: "Your Monthly Service Deleted"})
		}
	} catch (error) {
		return res.status(500).json({error: true, message: "Internal Server Error "})
	}
}

const UpdateMonthlyService = async (req, res) => {
	const orderNo = req.params.id;
	let data = req.body;

	try { // Destructure feesPaidDateTime and ignore it
		const {
			feesPaidDateTime,
			...updateData
		} = data;

		if (req.files) {
			const {before_cleaning, after_cleaning} = req.files;
			updateData.after_cleaning = after_cleaning ? after_cleaning[0].filename : null;
			updateData.before_cleaning = before_cleaning ? before_cleaning[0].filename : null;
		}

		const isDataUpdated = await MonthlyServiceModel.update(updateData, {
			where: {
				orderNo: orderNo
			}
		});

		if (isDataUpdated[0] > 0) {
			return res.status(200).json({status: 200, message: "Your Monthly Service Updated"});
		} else {
			return res.status(404).json({status: 404, message: "Order Not Found"});
		}
	} catch (error) {
		console.error(error); // Log the error for debugging
		return res.status(500).json({error: true, message: "Internal Server Error"});
	}
};


const getNextOrderNumber = async () => {
	const lastOrder = await MonthlyServiceModel.findOne({
		order: [
			['id', 'DESC']
		],
		attributes: ['orderNo']
	});

	if (lastOrder && lastOrder.orderNo) {
		const lastOrderNumber = lastOrder.orderNo;
		const orderNumberPart = parseInt(lastOrderNumber.split('-')[1]) + 1; // Extract the number and increment
		return `MORDN-${
			String(orderNumberPart).padStart(4, '0')
		}`; // Format to MORDN-XXXX
	}
	return 'MORDN-0001'; // If no orders found, start with MORDN-0001
};

const MonthlyServiceAssign = async (req, res) => {
	try {
		const orderID = req.params.id
		let data = req.body

		const isUpdated = await MonthlyServiceModel.update(data, {
			where: {
				orderNo: orderID,
				feesPaidDateTime: data.feesPaidDateTime
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

const MonthlyServiceSchedule = async (req, res) => {
    try {
        let date;

        // Check if the query parameter `date` is provided
        if (req.query.date) {
            // If provided, use the provided date
            date = new Date(req.query.date);
        } else {
            // If not provided, use tomorrow's date
            date = new Date();
            date.setDate(date.getDate() + 1);  // Increment the date by 1 to get tomorrow's date
        }

        // Format the date as "YYYY-MM-DD"
        let formattedDate = date.toISOString().split('T')[0];

        const data = await MonthlyServiceModel.findAll({
            attributes: [
                'orderNo',
                'cust_name',
                'bike_no',
                'feesPaidDateTime',
                'checkintime',
                'checkouttime',
                'serviceType',
                'pending',
                'service_provider',
                'selectedTimeSlot'
            ],
            where: {
                feesPaidDateTime: formattedDate
            }
        });

        const groupedData = data.reduce((acc, order) => {
			const providers = order.service_provider.split(", ").map(p => p.trim());
			providers.forEach(provider => {
				let providerEntry = acc.find(entry => entry.name === provider);
				if (!providerEntry) {
					providerEntry = { name: provider };
					acc.push(providerEntry);
				}
				const timeSlot = order.selectedTimeSlot;
				if (!providerEntry[timeSlot]) {
					providerEntry[timeSlot] = [];
				}
				providerEntry[timeSlot].push({
					orderNo: order.orderNo,
					cust_name: order.cust_name,
					bike_no: order.bike_no,
					feesPaidDateTime: order.feesPaidDateTime,
					checkintime: order.checkintime,
					checkouttime: order.checkouttime,
					serviceType: order.serviceType,
					pending: order.pending,
					service_provider: order.service_provider,
					selectedTimeSlot: order.selectedTimeSlot
				});
			});
			return acc;
		}, []);
		

        return res.status(200).json({ status: 200, result: groupedData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};


const GetSingleMonthlyService = async (req, res) => {
    try {
        const {orderNo, date} = req.body;
        // Check if dateParam is defined and not null, and also not the string "undefined"
        if (date !== undefined && date !== null && date !== "undefined") {
            date = new Date(date);  
        } else {
            date = new Date();  // Use the current date if dateParam is invalid
        }

        // Format the date as 'YYYY-MM-DD'
        const currentDate = date.toISOString().split('T')[0];

        // Query the database with the formatted date
        const data = await MonthlyServiceModel.findOne({
            where: {
				orderNo: orderNo,
                feesPaidDateTime: currentDate
            }
        });

        if (data.length > 0) {
            return res.status(200).json({ status: 200, data });
        } else {
            return res.status(200).json({ status: 200, data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};



module.exports = {
	AddMonthlyService,
	GetAllMonthlyService,
	DeleteMonthlyService,
	UpdateMonthlyService,
	MonthlyServiceAssign,
	MonthlyServiceSchedule,
	GetSingleMonthlyService
}
