const db = require("../../model/index");
const MonthlyServiceModel = db.MonthlyServiceModel
const CustomerModel = db.NewCustomerModel;
const AvailabilityModel = db.Availability;
const SupervisorAvailability = db.SupervisorAvailability
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel

const AddMonthlyService = async (req, res) => {
	const data = req.body;
	try { 
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

		const servicep_id = await ServiceProviderModel.findOne({
			where: { name: service_provider }
		});
		
		const supervisorData = await EmployeeModel.findOne({
			where: { name: supervisor }
		});


		if (!servicep_id) {
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

				// Prepare availability entry
				availabilityEntries.push({
					emp_id: servicep_id.id,
					date: formattedDate,
					[selectedTimeSlot]: serviceType + '-MonthlyService-' + data.cust_name + '-'+orderNumber,
				});

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
		

			// Bulk insert availability entries
			await AvailabilityModel.bulkCreate(availabilityEntries);
			await SupervisorAvailability.bulkCreate(availabilitySupervisor);
			// Bulk insert monthly service entries
			await MonthlyServiceModel.bulkCreate(monthlyEntries);
			return res.status(200).json({ status: true, message: 'Monthly Service Added!', orderNo: orderNumber });
		}

	} catch (error) {
		return res.status(500).json({ error: true, message: "Internal Server Error", error });
	}
}


const GetAllMonthlyService = async (req,res) =>{
    try{
		
		// const specifiedDate = req.body.date;

		const data = await MonthlyServiceModel.findAll({
			// where:{
			// 	feesPaidDateTime: specifiedDate
			// },
			order: [["id", "DESC"]]
		});


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

const UpdateMonthlyService = async (req,res) =>{
	const orderNo=req.params.id;
	const data=req.body
    try{
		if(req.files){
			const {before_cleaning, after_cleaning} = req.files;
			data.after_cleaning = after_cleaning ? after_cleaning[0].filename : null;
			data.before_cleaning = before_cleaning ? before_cleaning[0].filename : null;
		}
		
        const Isdata=await MonthlyServiceModel.update(data,{
			where: {
				orderNo: orderNo
			}
		});
        if(Isdata){
            return res.status(200).json({status:200,message:"Your Monthly Service Updated"})
        }
    }
    catch(error){
        return res.status(500).json({error:true,message:"Internal Server Error "})
    }
}


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
