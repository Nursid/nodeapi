const db = require("../../model/index");
const MonthlyServiceModel = db.MonthlyServiceModel
const CustomerModel = db.NewCustomerModel;
const AvailabilityModel = db.Availability;
const SupervisorAvailability = db.SupervisorAvailability
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
const sequelize = require('../../config/sequalize');
const moment2 = require('moment-timezone');
const moment = require('moment');

  // Define all time slots
const AllTimeSlots = [
    '07:00-07:30', '07:30-08:00', '08:00-08:30', '08:30-09:00', '09:00-09:30',
    '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
    '12:00-12:30', '12:30-01:00', '01:00-01:30', '01:30-02:00', '02:00-02:30',
    '02:30-03:00', '03:00-03:30', '03:30-04:00', '04:00-04:30', '04:30-05:00',
    '05:00-05:30', '05:30-06:00'
];


function getTimeSlots(checkintime, currentTime) {

    const checkinDate = new Date(checkintime);
    const currentDate = new Date(currentTime);

    const AllTimeSlots = [];
    let tempTime = new Date(checkinDate);
    tempTime.setMinutes(Math.floor(tempTime.getMinutes() / 30) * 30, 0, 0);

    while (tempTime <= currentDate) {
        let startHour = tempTime.getHours().toString().padStart(2, '0');
        let startMin = tempTime.getMinutes().toString().padStart(2, '0');

        let endTime = new Date(tempTime);
        endTime.setMinutes(tempTime.getMinutes() + 30);
        let endHour = endTime.getHours().toString().padStart(2, '0');
        let endMin = endTime.getMinutes().toString().padStart(2, '0');

        AllTimeSlots.push(`${startHour}:${startMin}-${endHour}:${endMin}`);
        tempTime = endTime;
    }

    return AllTimeSlots;
}

function convertTo12Hour(time) {
    let [hours, minutes] = time.split(":").map(Number);
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM, and 13+ to 1,2,3...
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function convertSlotsTo12Hour(slots) {
    return slots.map(slot => {
        const [start, end] = slot.split("-");
        return `${convertTo12Hour(start)}-${convertTo12Hour(end)}`;
    });
}



const clearAvailability = async (orderID, feesPaidDateTime, transaction) => {
    try {
        // Fetch the order details with service providers
        const isService = await MonthlyServiceModel.findOne({
            where: {
                orderNo: orderID,
                feesPaidDateTime: feesPaidDateTime
            }
        });

        // Check if the order exists
        if (!isService) {
            console.log("Order not found");
            return true; // Return true if no order is found (no action needed)
        }

        // Extract order data
        const { service_provider, selectedTimeSlot, serviceType, cust_name } = isService;

        // Convert service_provider to an array if it's a comma-separated string
        const serviceProviderNames = Array.isArray(service_provider) ? service_provider : service_provider.split(',');

        // Iterate over each service provider
        for (const serviceProviderName of serviceProviderNames) {
            // Fetch the service provider ID
            const serviceProviderRecord = await ServiceProviderModel.findOne({
                attributes: ['id'],
                where: {
                    name: serviceProviderName.trim()
                }
            });

            if (!serviceProviderRecord) {
                console.log(`Service provider not found: ${serviceProviderName}`);
                continue; // Skip to the next service provider
            }

            const servicepId = serviceProviderRecord.id;

            // Fetch the existing availability record
            const existing = await AvailabilityModel.findOne({
                where: { emp_id: servicepId, date: feesPaidDateTime }
            });

            if (!existing) {
                console.log(`Availability record not found for service provider: ${serviceProviderName}`);
                continue; // Skip to the next service provider
            }

            // Convert selectedTimeSlot to an array if it's a comma-separated string
            const timeSlotsArray = Array.isArray(selectedTimeSlot) ? selectedTimeSlot : selectedTimeSlot.split(',');

            // Clear each selected time slot in the availability record
            const updatePayload = {};
            for (const slot of timeSlotsArray) {
                if (existing[slot.trim()] === `${serviceType}-MonthlyService-${cust_name}-${orderID}`) {
                    updatePayload[slot.trim()] = 'p'; // Clear the slot
                }
                if (existing[slot.trim()] === `${serviceType}-MonthlyService-${cust_name}-pending`) {
                    updatePayload[slot.trim()] = 'p'; // Clear the slot
                }
            }

            // Update the availability record
            if (Object.keys(updatePayload).length > 0) {
                await AvailabilityModel.update(updatePayload, {
                    where: {
                        emp_id: servicepId,
                        date: feesPaidDateTime
                    },
                    transaction // Use the provided transaction
                });
            }
        }

        return true; // Successfully cleared availability
    } catch (error) {
        console.error("Error clearing availability:", error);
        return false; // Return false if an error occurs
    }
};


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
            let cycleCount = 0;
            for (let i = 0; i < 30; i += incrementDays) {
                const formattedDate = currentDate.toISOString().split('T')[0];


                  // Determine the specific service for the day
        let serviceForTheDay = serviceType;
        if (serviceType === "Car Washing/Dusting" && serviceServeType === "Alternative") {                    
            if (cycleCount % 3 === 2) { // Every 3rd cycle (e.g., 6th day, 12th day, etc.)
                serviceForTheDay = "Car Washing";
            } else { // For the other two cycles
                serviceForTheDay = "Car Dusting";
            }
            cycleCount++; // Increment the cycle counter
        }

                validProviderIds.forEach(servicepId => {
                    selectedTimeSlots.forEach(slot => {
                        availabilityEntries.push({
                            emp_id: servicepId,
                            date: formattedDate,
                            [slot]: `${serviceForTheDay}-MonthlyService-${data.cust_name}-${orderNumber}`
                        });
                    });
                });

                selectedTimeSlots.forEach(slot => {
                    supervisorEntries.push({
                        emp_id: supervisorData.emp_id,
                        date: formattedDate,
                        [slot]: `${serviceForTheDay}-MonthlyService-${data.cust_name}-${orderNumber}`
                    });
                });

                monthlyEntries.push({
                    ...data,
                    serviceType: serviceForTheDay,
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

            return res.status(200).json({ status: true, message: 'Monthly Service Added!', orderNo: orderNumber , availabilityEntries});
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
        const customer = req.query.customer;

        // Handle date parameter
        if (dateParam && dateParam !== "undefined" && dateParam !== "null") {
            date = new Date(dateParam);
        } else if (!customer || customer === "undefined" || customer === "null") {
            // If customer is null or undefined, set the date to the current date
            date = new Date();
        }

        // Build query object
        const query = {};
        if (date) {
            query.feesPaidDateTime = date.toISOString().split('T')[0];
        }

        if (customer && customer !== "undefined" && customer !== "null") {
            query.cust_name = customer;
        }

        console.log("query-----------", query);

        // Query the database with the formatted date
        const data = await MonthlyServiceModel.findAll({
            where: query
        });

        if (data.length > 0) {
            return res.status(200).json({ status: 200, data, query });
        } else {
            return res.status(200).json({ status: 200, data: [], query });
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
    const transaction = await sequelize.transaction();
    const orderNo = req.params.id;
    const updateDate = req.query.date; // Original date from query
    let data = req.body;

    try {
        const {
            feesPaidDateTime, // New date from body
            selectedTimeSlot,
            service_provider,
            supervisor,
            ...updateData
        } = data;

        const isService = await MonthlyServiceModel.findOne({
            where: {
                orderNo: orderNo,
                feesPaidDateTime: feesPaidDateTime
            }
        });


        // Check if the order exists
        if (!isService) {
            console.log("Order not found");
            return true; // Return true if no order is found (no action needed)
        }
        // Handle file uploads
        if (req.files) {
            const { before_cleaning, after_cleaning } = req.files;
            updateData.before_cleaning = before_cleaning ? before_cleaning[0].filename : null;
            updateData.after_cleaning = after_cleaning ? after_cleaning[0].filename : null;
        }

        // Initialize arrays with default values
        const selectedTimeSlots = selectedTimeSlot ? selectedTimeSlot.split(',').map(item => item.trim()) : [];
        const providerNames = service_provider ? service_provider.split(',').map(item => item.trim()) : [];
        
        // Update data with processed values
        updateData.selectedTimeSlot = selectedTimeSlots.join(',');
        updateData.service_provider = providerNames.join(',');
        updateData.feesPaidDateTime = feesPaidDateTime; // Set the new date

        // Get service provider IDs
        const serviceProviderIds = await Promise.all(
            providerNames.map(async name => {
                const provider = await ServiceProviderModel.findOne({ where: { name } });
                return provider?.id || null;
            })
        );
        const validProviderIds = serviceProviderIds.filter(Boolean);

        // Validate supervisor exists
        const supervisorData = await EmployeeModel.findOne({ where: { name: supervisor } });
        if (!supervisorData) {
            await transaction.rollback();
            return res.status(400).json({ error: true, message: "Supervisor not found" });
        }

        // Prepare availability entries
        const availabilityEntries = [];
        validProviderIds.forEach(servicepId => {
            selectedTimeSlots.forEach(slot => {
                availabilityEntries.push({
                    emp_id: servicepId,
                    date: feesPaidDateTime, // Using new date
                    [slot]: `${data.serviceType}-MonthlyService-${data.cust_name}-${orderNo}`
                });
            });
        });

        // Prepare supervisor entries
        const supervisorEntries = [];
        selectedTimeSlots.forEach(slot => {
            supervisorEntries.push({
                emp_id: supervisorData.emp_id,
                date: feesPaidDateTime, // Using new date
                [slot]: `${data.serviceType}-MonthlyService-${data.cust_name}-${orderNo}`
            });
        });

        // Merge duplicate entries (same emp_id + date)
        const mergedServiceProviderEntries = availabilityEntries.reduce((acc, curr) => {
            const existing = acc.find(e => e.emp_id === curr.emp_id && e.date === curr.date);
            if (existing) Object.assign(existing, curr);
            else acc.push(curr);
            return acc;
        }, []);

        const mergedSupervisorEntries = supervisorEntries.reduce((acc, curr) => {
            const existing = acc.find(e => e.emp_id === curr.emp_id && e.date === curr.date);
            if (existing) Object.assign(existing, curr);
            else acc.push(curr);
            return acc;
        }, []);

        // Update/Create availability records
        await Promise.all(mergedServiceProviderEntries.map(async entry => {
            const existing = await AvailabilityModel.findOne({
                where: { emp_id: entry.emp_id, date: entry.date },
                transaction
            });
            existing ? await existing.update(entry, { transaction }) 
                     : await AvailabilityModel.create(entry, { transaction });
        }));


     
        let updatedOrder;
        if (isService.pending !== 4) {
            updatedOrder =  await clearAvailability(orderNo, feesPaidDateTime, transaction)

            if (!updatedOrder) {
                await transaction.rollback();
                return res.status(202).json({ error: true, message: 'Order not updated' });
            }
        }
        // Update/Create supervisor records
        await Promise.all(mergedSupervisorEntries.map(async entry => {
            const existing = await SupervisorAvailability.findOne({
                where: { emp_id: entry.emp_id, date: entry.date },
                transaction
            });
            existing ? await existing.update(entry, { transaction }) 
                     : await SupervisorAvailability.create(entry, { transaction });
        }));

        // Update main service record using ORIGINAL date in WHERE clause
        const isDataUpdated = await MonthlyServiceModel.update(updateData, {
            where: {
                orderNo: orderNo,
                feesPaidDateTime: updateDate // Query by original date
            },
            transaction
        });

         // 2. Conditionally update payment amount across all dates
         let paymentUpdate = [0];
         if (updateData.piadamt !== undefined) {
             paymentUpdate = await MonthlyServiceModel.update(
                 { piadamt: updateData.piadamt,
                    // serviceType: updateData.serviceType,
                  },
                 { 
                     where: { orderNo },
                     transaction
                 }
             );
         }

        // Transaction handling corrected
        if (isDataUpdated[0] > 0) {
            await transaction.commit();
            return res.status(200).json({
                status: 200,
                message: "Monthly Service Updated",
                updateData,
                mergedServiceProviderEntries,
                updateDate
            });
        } else {
            await transaction.rollback();
            return res.status(404).json({
                status: 404,
                message: "Order not found with specified date",
                updateDate
            });
        }
    } catch (error) {
        await transaction.rollback();
        console.error("Update Error:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
            details: error.message
        });
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
                feesPaidDateTime: formattedDate,
                pending: {
                    [db.Sequelize.Op.in]: [0, 2, 3, 4]
                }
            }
        });

        const groupedData = data.reduce((acc, order) => {
            const providers = order.service_provider.split(", ").map(p => p.trim());
            const timeSlots = order.selectedTimeSlot.split(",").map(slot => slot.trim());

            providers.forEach(provider => {
                let providerEntry = acc.find(entry => entry.name === provider);
                if (!providerEntry) {
                    providerEntry = { name: provider };
                    acc.push(providerEntry);
                }

                timeSlots.forEach(timeSlot => {
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
                        selectedTimeSlot: timeSlot // Use the individual time slot here
                    });
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
        console.log(orderNo, date);
        let dateParam;
        // Check if dateParam is defined and not null, and also not the string "undefined"
        if (date !== undefined && date !== null && date !== "undefined") {
            dateParam = date;  
        } else {
            const date = new Date();  // Use the current date if dateParam is invalid
           dateParam = date.toISOString().split('T')[0];
        }
    
        // Query the database with the formatted date
        const data = await MonthlyServiceModel.findOne({
            where: {
				orderNo: orderNo,
                feesPaidDateTime: dateParam
            }
        });
            return res.status(200).json({ status: 200, data: data });

        // if (data.length > 0) {
        //     return res.status(200).json({ status: 200, data });
        // } else {
        // }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const MonthlyServiceCheckOut = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const orderID = req.params.id;
        const data = req.body;

        let date = new Date();

        // Convert the date to Kolkata time zone (IST) without milliseconds
        let kolkataTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false });
  
        // Extract the hours and minutes
        let timeParts = kolkataTime.split(', ')[1].split(':');
        let hours = parseInt(timeParts[0]);
        let minutes = parseInt(timeParts[1]);     
        // let hours = 7
        // let minutes = 40 
  
        // // Check if the time is between 6:00 PM and 6:00 AM
        // let isAfterSixPM = (hours >= 18); // 6 PM is 18 in 24-hour format
        // let isBeforeSixAM = (hours < 6); // 6 AM is less than 6 in 24-hour format
  
        // if (isAfterSixPM || isBeforeSixAM) {
        //     return  res.status(202).json({status: false, message: "Invailid Time To Check In" });
        // }


        // Extract the current date without time
        const currentDate = date.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" });
        const kolkataDate = moment(currentDate).format("YYYY-MM-DD");

        // Compare the dates
        if (kolkataDate > data.feesPaidDateTime) {
            await MonthlyServiceModel.update(data, {
                where: {
                    orderNo: orderID,
                    feesPaidDateTime: data.feesPaidDateTime
                },
                transaction
            });
            await transaction.commit();
            return res.status(200).json({ status: 200, message: "Checkout Successful!" });
        }

        // Fetch the monthly service
        const isService = await MonthlyServiceModel.findOne({
            where: {
                orderNo: orderID,
                feesPaidDateTime: data.feesPaidDateTime
            },
            transaction
        });

        if (!isService) {
            await transaction.rollback();
            return res.status(400).json({ error: true, message: 'Service not found!' });
        }

        // Handle multiple service providers
        const serviceProviders = isService.service_provider;
        const serviceProviderNames = Array.isArray(serviceProviders) ? serviceProviders : serviceProviders.split(',');

        for (const serviceProviderName of serviceProviderNames) {
            // Fetch the service provider ID
            const serviceProviderRecord = await ServiceProviderModel.findOne({
                attributes: ['id'],
                where: {
                    name: serviceProviderName.trim()
                },
                transaction
            });

            if (!serviceProviderRecord) {
                await transaction.rollback();
                return res.status(400).json({ error: true, message: `Service provider not found: ${serviceProviderName}` });
            }

            const servicepId = serviceProviderRecord.id;

            // Generate time slots
            const formattedTime = moment(isService.checkintime, "MM/DD/YYYY, h:mm A").format("MM/DD/YYYY, hh:mm A");
            const currentDateTime = moment().tz("Asia/Kolkata").format("DD/MM/YYYY, hh:mm A");
            const formattedOrders = getTimeSlots(formattedTime, currentDateTime);
            const slots = convertSlotsTo12Hour(formattedOrders);

            const updatedSlots = slots.reduce((acc, slot) => {
                acc[slot] = `${isService.serviceType}-MonthlyService-${isService.cust_name}-completed`;
                return acc;
            }, {});

            // Update the monthly service
            await MonthlyServiceModel.update(data, {
                where: {
                    orderNo: orderID,
                    feesPaidDateTime: data.feesPaidDateTime
                },
                transaction
            });

            // Update availability for the service provider
            const existing = await AvailabilityModel.findOne({
                where: { emp_id: servicepId, date: data.feesPaidDateTime },
                transaction
            });

            if (!existing) {
                await transaction.rollback();
                return res.status(400).json({ error: true, message: 'Availability record not found!' });
            }

            await AvailabilityModel.update(updatedSlots, {
                where: {
                    emp_id: servicepId,
                    date: data.feesPaidDateTime
                },
                transaction
            });
        }

        await transaction.commit();
        res.status(200).json({ status: 200, message: 'Assign Successful!' });

    } catch (error) {
        console.error(error);
        await transaction.rollback();
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

const MonthlyServiceCheckIn = async (req, res) => {
    try {
        const orderID = req.params.id;
        const data = req.body;

        const isService = await MonthlyServiceModel.findOne({
            where: {
                orderNo: orderID,
                feesPaidDateTime: data.feesPaidDateTime
            }
        });

        if (!isService) {
            return res.status(400).json({ error: true, message: 'Service not found!' });
        }

        const serviceProviders = isService.service_provider;
        const serviceProviderNames = Array.isArray(serviceProviders) ? serviceProviders : serviceProviders.split(',');

        for (const serviceProviderName of serviceProviderNames) {
            const serviceProviderRecord = await ServiceProviderModel.findOne({
                attributes: ['id'],
                where: {
                    name: serviceProviderName.trim()
                }
            });

            if (!serviceProviderRecord) {
                return res.status(400).json({ error: true, message: `Service provider not found: ${serviceProviderName}` });
            }

            const servicepId = serviceProviderRecord.id;

            await MonthlyServiceModel.update(data, {
                where: {
                    orderNo: orderID,
                    feesPaidDateTime: data.feesPaidDateTime
                }
            });

            const existing = await AvailabilityModel.findOne({
                where: { emp_id: servicepId, date: data.feesPaidDateTime }
            });

            if (!existing) {
                return res.status(400).json({ error: true, message: 'Availability record not found!' });
            }

            const selectedTimeSlots = isService.selectedTimeSlot;
            const timeSlotsArray = Array.isArray(selectedTimeSlots) ? selectedTimeSlots : selectedTimeSlots.split(',');

            const updatePayload = {};
            for (const slot of timeSlotsArray) {
                updatePayload[slot.trim()] = `p`;
            }

            await AvailabilityModel.update(updatePayload, {
                where: {
                    emp_id: servicepId,
                    date: data.feesPaidDateTime
                }
            });
        }

        res.status(200).json({ status: 200, message: 'Assign Successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

const MonthlyServiceHold = async (req, res) => {
    try {
        const orderID = req.params.id;
        const data = req.body;

        // Fetch the monthly service
        const isService = await MonthlyServiceModel.findOne({
            where: {
                orderNo: orderID,
                feesPaidDateTime: data.feesPaidDateTime,

            }
        });

        if (!isService) {
            return res.status(400).json({ error: true, message: 'Service not found!' });
        }

        // Fetch the service providers
        const serviceProviders = isService.service_provider;
        const serviceProviderNames = Array.isArray(serviceProviders) ? serviceProviders : serviceProviders.split(',');

        // Iterate over each service provider
        for (const serviceProviderName of serviceProviderNames) {
            // Fetch the service provider ID
            const serviceProviderRecord = await ServiceProviderModel.findOne({
                attributes: ['id'],
                where: {
                    name: serviceProviderName.trim()
                }
            });

            if (!serviceProviderRecord) {
                return res.status(400).json({ error: true, message: `Service provider not found: ${serviceProviderName}` });
            }

            const servicepId = serviceProviderRecord.id;

            // Update the monthly service
            const isUpdated = await MonthlyServiceModel.update(data, {
                where: {
                    orderNo: orderID,
                    feesPaidDateTime: data.feesPaidDateTime
                }
            });

            if (!isUpdated) {
                return res.status(400).json({ error: true, message: 'Updation Failed! Try again' });
            }

            // Fetch the existing availability record
            const existing = await AvailabilityModel.findOne({
                where: { emp_id: servicepId, date: data.feesPaidDateTime }
            });

            if (!existing) {
                return res.status(400).json({ error: true, message: 'Availability record not found!' });
            }

            // Get the selected time slots from the request body
            const selectedTimeSlots = isService.selectedTimeSlot; // Assuming `selectedTimeSlots` is an array or comma-separated string

            // Convert selectedTimeSlots to an array if it's a comma-separated string
            const timeSlotsArray = Array.isArray(selectedTimeSlots) ? selectedTimeSlots : selectedTimeSlots.split(',');

            // Validate each selected time slot
            for (const slot of timeSlotsArray) {
                if (!AllTimeSlots.includes(slot.trim())) {
                    return res.status(400).json({ error: true, message: `Invalid time slot selected: ${slot}` });
                }

                // Check if the selected time slot exists in the availability record
                if (!existing[slot.trim()]) {
                    return res.status(400).json({ error: true, message: `Selected time slot does not exist in availability: ${slot}` });
                }
            }

            // Update each selected time slot in the availability record
            const updatePayload = {};
            for (const slot of timeSlotsArray) {
                updatePayload[slot.trim()] = `p`;
            }

            const updatedAvailability = await AvailabilityModel.update(updatePayload, {
                where: {
                    emp_id: servicepId,
                    date: data.feesPaidDateTime
                }
            });

            if (!updatedAvailability) {
                return res.status(400).json({ error: true, message: 'Failed to update availability!' });
            }
        }

        res.status(200).json({ status: 200, message: "Assign Successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const MonthlyServiceUnHold = async (req, res) => {
    try {
        const orderID = req.params.id;
        const data = req.body;

        // Fetch the monthly service
        const isService = await MonthlyServiceModel.findOne({
            where: {
                orderNo: orderID,
                feesPaidDateTime: data.feesPaidDateTime
            }
        });

        if (!isService) {
            return res.status(400).json({ error: true, message: 'Service not found!' });
        }

        // Fetch the service providers
        const serviceProviders = isService.service_provider;
        const serviceProviderNames = Array.isArray(serviceProviders) ? serviceProviders : serviceProviders.split(',');

        // Iterate over each service provider
        for (const serviceProviderName of serviceProviderNames) {
            // Fetch the service provider ID
            const serviceProviderRecord = await ServiceProviderModel.findOne({
                attributes: ['id'],
                where: {
                    name: serviceProviderName.trim()
                }
            });

            if (!serviceProviderRecord) {
                return res.status(400).json({ error: true, message: `Service provider not found: ${serviceProviderName}` });
            }

            const servicepId = serviceProviderRecord.id;

            // Update the monthly service
            const isUpdated = await MonthlyServiceModel.update(data, {
                where: {
                    orderNo: orderID,
                    feesPaidDateTime: data.feesPaidDateTime
                }
            });

            if (!isUpdated) {
                return res.status(400).json({ error: true, message: 'Updation Failed! Try again' });
            }

            // Fetch the existing availability record
            const existing = await AvailabilityModel.findOne({
                where: { emp_id: servicepId, date: data.feesPaidDateTime }
            });

            if (!existing) {
                return res.status(400).json({ error: true, message: `Availability record not found for: ${serviceProviderName}` });
            }

            // Get the selected time slots from the request body
            const selectedTimeSlots = isService.selectedTimeSlot;

            // Convert selectedTimeSlots to an array if it's a comma-separated string
            const timeSlotsArray = Array.isArray(selectedTimeSlots) ? selectedTimeSlots : selectedTimeSlots.split(',');

            // Validate and update each selected time slot
            const updatePayload = {};
            for (const slot of timeSlotsArray) {
                if (!AllTimeSlots.includes(slot.trim())) {
                    return res.status(400).json({ error: true, message: `Invalid time slot selected: ${slot}` });
                }

                if (!existing[slot.trim()]) {
                    return res.status(400).json({ error: true, message: `Selected time slot does not exist in availability: ${slot}` });
                }

                updatePayload[slot.trim()] = `${isService.serviceType}-MonthlyService-${isService.cust_name}`;
            }

            const updatedAvailability = await AvailabilityModel.update(updatePayload, {
                where: {
                    emp_id: servicepId,
                    date: data.feesPaidDateTime
                }
            });

            if (!updatedAvailability) {
                return res.status(400).json({ error: true, message: 'Failed to update availability!' });
            }
        }

        res.status(200).json({ status: 200, message: "UnHold Successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const AddCheckInCheckOutLateTime = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const today = new Date();
        const options = { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" };
        const formattedDate = new Intl.DateTimeFormat("en-CA", options).format(today);

        let date = new Date();

        // Convert the date to Kolkata time zone (IST) without milliseconds
        let kolkataTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false });
  
        // Extract the hours and minutes
        let timeParts = kolkataTime.split(', ')[1].split(':');
        let hours = parseInt(timeParts[0]);
        let minutes = parseInt(timeParts[1]);     
        // let hours = 7
        // let minutes = 40 
  
        // Check if the time is between 6:00 PM and 6:00 AM
        let isAfterSixPM = (hours >= 18); // 6 PM is 18 in 24-hour format
        let isBeforeSixAM = (hours < 6); // 6 AM is less than 6 in 24-hour format
  
        if (isAfterSixPM || isBeforeSixAM) {
            return  res.status(202).json({status: false, message: "Invailid Time To Check In" });
        }

        const orders = await MonthlyServiceModel.findAll({
            where: {
                feesPaidDateTime: formattedDate,
                pending: 4
            }
        });

        if (!orders || orders.length === 0) {
            return res.status(202).json({ status: false, message: "No orders found." });
        }

        const orderUpdate = [];
        const errorLogs = [];

        await Promise.all(
            orders.map(async (item) => {
                try {
                    const serviceProviders = item.service_provider;
                    const serviceProviderNames = Array.isArray(serviceProviders) ? serviceProviders : serviceProviders.split(',');

                    for (const serviceProviderName of serviceProviderNames) {
                        // Fetch the service provider ID
                        const serviceProviderRecord = await ServiceProviderModel.findOne({
                            attributes: ['id'],
                            where: {
                                name: serviceProviderName.trim()
                            }
                        });

                        if (!serviceProviderRecord) {
                            errorLogs.push({
                                order_no: item.order_no,
                                error: `Service provider not found: ${serviceProviderName}`
                            });
                            continue;
                        }

                        const servicepId = serviceProviderRecord.id;
                        const formattedTime = moment(item.checkintime, "DD/MM/YYYY, h:mm A").format("MM/DD/YYYY, hh:mm A");
                        const currentDateTime = moment2().tz("Asia/Kolkata").format("DD/MM/YYYY, hh:mm A");
                        const formattedOrders = getTimeSlots(formattedTime, currentDateTime);
                        const slots = convertSlotsTo12Hour(formattedOrders);

                        const updatedSlots = slots.reduce((acc, slot) => {
                            acc[slot] = `${item.serviceType}-MonthlyService-${item.cust_name}-pending`;
                            return acc;
                        }, {});

                        // Check if availability already exists
                        const existing = await AvailabilityModel.findOne({
                            where: { emp_id: servicepId, date: formattedDate }
                        });

                        if (!existing) {
                            await AvailabilityModel.create({
                                date: formattedDate,
                                emp_id: servicepId,
                                ...updatedSlots
                            }, { transaction });
                        } else {
                            await AvailabilityModel.update(updatedSlots, {
                                where: { emp_id: servicepId, date: formattedDate },
                                transaction
                            });
                        }

                        orderUpdate.push({ 
                            formattedTime,
                            currentDateTime,
                            updatedSlots,
                            order_no: item.orderNo,
                            service_provider: serviceProviderName,

                        });
                    }

                } catch (orderProcessingError) {
                    console.error(`⚠️ Error processing order ${item.orderNo}: ${orderProcessingError.message}`);
                    errorLogs.push({
                        order_no: item.orderNo,
                        error: orderProcessingError.message
                    });
                }
            })
        );

        await transaction.commit();
        return res.status(200).json({
            success: true,
            updated_orders: orderUpdate,
            errors: errorLogs.length > 0 ? errorLogs : "All orders processed successfully."
        });

    } catch (error) {
        console.error("🚨 Transaction failed:", error.message);
        await transaction.rollback();
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    } finally {
        if (transaction.finished !== "commit") {
            await transaction.rollback();
        }
    }
};



module.exports = {
	AddMonthlyService,
	GetAllMonthlyService,
	DeleteMonthlyService,
	UpdateMonthlyService,
	MonthlyServiceAssign,
	MonthlyServiceSchedule,
	GetSingleMonthlyService,
    MonthlyServiceCheckOut,
    MonthlyServiceCheckIn,
    MonthlyServiceHold,
    MonthlyServiceUnHold,
    AddCheckInCheckOutLateTime
}
