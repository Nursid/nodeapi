const db = require("../../model/index");
const MonthlyServiceModel = db.MonthlyServiceModel
const CustomerModel = db.NewCustomerModel;
const AvailabilityModel = db.Availability;
const SupervisorAvailability = db.SupervisorAvailability
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
const sequelize = require('../../config/sequalize'); 

const AddMonthlyService = async (req, res) => {

	const data = req.body;
	try { 
		const transaction = await sequelize.transaction();

		if (req.files) {
			const { before_cleaning, after_cleaning } = req.files;
			data.after_cleaning = after_cleaning ? after_cleaning[0].filename : null;
			data.before_cleaning = before_cleaning ? before_cleaning[0].filename : null;
		}

		const UserId = await CustomerModel.findOne({
			where: { mobileno: data.mobile_no }
		});
		if (!UserId) {
			return res.status(201).json({ status: false, message: "This Customer not Exist" });
		}

		data.user_id = UserId.id;

		const { serviceServeType, feesPaidDateTime, service_provider, serviceType, selectedTimeSlot, supervisor } = data;

		const multiServiceProvider = service_provider.split(',').map(item => item.trim()) 


		const servicep_ids = await Promise.all(
			multiServiceProvider.map(async (providerName) => {
				const serviceProvider = await ServiceProviderModel.findOne({
					where: { name: providerName }
				});
				return serviceProvider ? serviceProvider.id : null;
			})
		);
		
		// Filter out any null values in case some providers were not found
		const valid_servicep_ids = servicep_ids.filter(id => id !== null);

		const supervisorData = await EmployeeModel.findOne({
			where: { name: supervisor }
		});

		if (valid_servicep_ids.length === 0) {
			return res.status(201).json({ status: false, message: "This Service Provider not Exist" });
		}

		if (["Weekly", "Daily", "Alternative"].includes(data.serviceServeType)) {
			const availabilityEntries = [];
			const availabilitySupervisor = [];
			const monthlyEntries = [];
			const [date] = feesPaidDateTime.split('T');
			const [year, month, day] = date.split('-');
			const currentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

			let incrementDays;
			switch (data.serviceServeType) {
				case "Weekly":
					incrementDays = 7;
					break;
				case "Alternative":
					incrementDays = 2;
					break;
				case "Daily":
					incrementDays = 1;
					break;
				default:
					incrementDays = 0; // Shouldn't happen
					break;
			}

			const orderNumber = await getNextOrderNumber(); 
		
				for (let i = 0; i < 30; i += incrementDays) {
					const formattedDate = currentDate.toLocaleDateString('en-CA');
	
					valid_servicep_ids.map((servicepId)=>{
						availabilityEntries.push({
							emp_id: servicepId,
							date: formattedDate,
							[selectedTimeSlot]: serviceType + '-MonthlyService-' + data.cust_name + '-'+orderNumber,
						});
					})
	
					availabilitySupervisor.push({
						emp_id: supervisorData.emp_id,
						date: formattedDate,
						[selectedTimeSlot]: serviceType + '-MonthlyService-' + data.cust_name + '-'+orderNumber,
					});
	
					const newdata = {
						...data,
						feesPaidDateTime: formattedDate,	
						orderNo: orderNumber,
						pending: 0,
					}
	
					// Prepare monthly service entry
					monthlyEntries.push({
						...newdata	
					});
	
					// Increment date
					currentDate.setDate(currentDate.getDate() + incrementDays);
				}
			

	
    for (const entry of availabilityEntries) {
        // Check if a record with the same emp_id and date already exists
        const existingEntry = await AvailabilityModel.findOne({
            where: {
                emp_id: entry.emp_id,
                date: entry.date,
            },
            transaction,
        });

        if (existingEntry) {
            // If it exists, update the record
            await existingEntry.update(entry,{
				where: {
					emp_id: entry.emp_id,
					date: entry.date,
				}
			},{ transaction });
        } else {
            // If it doesn't exist, insert a new record
            await AvailabilityModel.create(entry, { transaction });
        }
    }

    for (const supervisorEntry of availabilitySupervisor) {
        // Check if a record with the same emp_id and date already exists
        const existingSupervisor = await SupervisorAvailability.findOne({
            where: {
                emp_id: supervisorEntry.emp_id,
                date: supervisorEntry.date,
            },
            transaction,
        });

        if (existingSupervisor) {
            // If it exists, update the record
            await existingSupervisor.update(supervisorEntry,{
				where: {
					emp_id: supervisorEntry.emp_id,
					date: supervisorEntry.date,
			}},
			{ transaction });
        } else {
            // If it doesn't exist, insert a new record
            await SupervisorAvailability.create(supervisorEntry, { transaction });
        }
    }

    // Commit the transaction
	await MonthlyServiceModel.bulkCreate(monthlyEntries, {
		transaction
	});
    await transaction.commit();
			return res.status(200).json({ status: true, message: 'Monthly Service Added!', orderNo: orderNumber });
		}

	} catch (error) {
		
		await transaction.rollback();
		return res.status(500).json({ error: true, message: "Internal Server Error", error });
	}
}

const GetAllMonthlyService = async (req,res) =>{
    try{
		const data = await MonthlyServiceModel.findAll();

        if(data){
            return res.status(200).json({status:200, data})
        }
    }
    catch(error){
		console.log(error)
        return res.status(500).json({error:true,message:"Internal Server Error "})
    }
}

const DeleteMonthlyService = async (req,res) =>{
	const id=req.params.id
    try{
		
        const data=await MonthlyServiceModel.destroy({
			where: {
				id: id
			}
		});
		
        if(data){
            return res.status(200).json({status:200,data:"Your Monthly Service Deleted"})
        }
    }
    catch(error){
        return res.status(500).json({error:true,message:"Internal Server Error "})
    }
}

const UpdateMonthlyService = async (req, res) => {
    const orderNo = req.params.id;
    let data = req.body;

    try {
        // Destructure feesPaidDateTime and ignore it
        const { feesPaidDateTime, ...updateData } = data;

        if (req.files) {
            const { before_cleaning, after_cleaning } = req.files;
            updateData.after_cleaning = after_cleaning ? after_cleaning[0].filename : null;
            updateData.before_cleaning = before_cleaning ? before_cleaning[0].filename : null;
        }

        const isDataUpdated = await MonthlyServiceModel.update(updateData, {
            where: {
                orderNo: orderNo
            }
        });

        if (isDataUpdated[0] > 0) {
            return res.status(200).json({ status: 200, message: "Your Monthly Service Updated" });
        } else {
            return res.status(404).json({ status: 404, message: "Order Not Found" });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};


const getNextOrderNumber = async () => {
    const lastOrder = await MonthlyServiceModel.findOne({
        order: [['id', 'DESC']],
        attributes: ['orderNo'],
    });

    if (lastOrder && lastOrder.orderNo) {
        const lastOrderNumber = lastOrder.orderNo;
        const orderNumberPart = parseInt(lastOrderNumber.split('-')[1]) + 1; // Extract the number and increment
        return `MORDN-${String(orderNumberPart).padStart(4, '0')}`; // Format to MORDN-XXXX
    }
    
    return 'MORDN-0001'; // Start with MORDN-0001 if no entries exist
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

module.exports = {
	AddMonthlyService,
    GetAllMonthlyService,
	DeleteMonthlyService,
	UpdateMonthlyService,
	MonthlyServiceAssign
}
