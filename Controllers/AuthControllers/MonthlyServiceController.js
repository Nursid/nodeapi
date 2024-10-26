const { name } = require("ejs");
const db = require("../../model/index");

const MonthlyServiceModel = db.MonthlyServiceModel
const CustomerModel = db.NewCustomerModel;
const AvailabilityModel = db.Availability
const ServiceProviderModel = db.ServiceProviderModel

const AddMonthlyService = async (req, res) => {
	const data = req.body;
	try { 

		if(req.files){
			const {before_cleaning, after_cleaning} = req.files;
			data.after_cleaning = after_cleaning ? after_cleaning[0].filename : null;
			data.before_cleaning = before_cleaning ? before_cleaning[0].filename : null;
		}

		const UserId = await CustomerModel.findOne({
			where: {
				mobileno: data.mobile_no
			}
		});
		if (! UserId) {
			return res.status(201).json({status: false, message: "This Customer not Exist"});
		}

		data.user_id = UserId.id

		
		const { serviceServeType, feesPaidDateTime, service_provider, serviceType, selectedTimeSlot } = data;


		const servicep_id = await ServiceProviderModel.findOne({
			where: {
				name: service_provider
			}
		});

		if (! servicep_id) {
			return res.status(201).json({status: false, message: "This Service Provider not Exist"});
		}

		// Check the serviceServeType and insert accordingly
		if (data?.serviceServeType === "Weekly" || data?.serviceServeType === "Daily" || data?.serviceServeType === "Alternative" ) {
			const entries = [];


			const [date] = feesPaidDateTime.split('T'); // Get the date part
			const [year, month, day] = date.split('-'); 

			const currentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

			// const incrementDays = serviceServeType === "Weekly" ? 7 : 1;


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
					incrementDays = 0; // Just in case, although this shouldn't happen
					break;
			}

          // Loop to generate entries with the correct gap
		  for (let i = 0; i < 30; i += incrementDays) { 
			const formattedDate =  currentDate.toLocaleDateString('en-CA') 

			entries.push({
			  emp_id: servicep_id.id,
			  date: formattedDate, // Use formatted date here
			  [selectedTimeSlot]: serviceType + '-MonthlyService-'+ data?.cust_name, 
			});
	
			// Increment date by 7 days for "weekly" or 1 day for "daily"
			currentDate.setDate(currentDate.getDate() + incrementDays);
		  }
		  // Bulk insert data for "weekly" or "daily" entries
		  await AvailabilityModel.bulkCreate(entries);
		}
		const newData = await MonthlyServiceModel.create({
			...data
		});

		if (!newData) {
			return res.status(201).json({status: false, message: "Invalid error"});
		}

		return res.status(200).json({status: true, message:"Monthly Service Added!" });
	} catch (error) { // If any error occurs, respond with an error message
		return res.status(500).json({error: true, message: "Internal Server Error" , error});
	}
}

const GetAllMonthlyService = async (req,res) =>{
    try{
        const data=await MonthlyServiceModel.findAll({
			order: [["id","DESC"]]
		});
        if(data){
            return res.status(200).json({status:200,data:data})
        }
    }
    catch(error){
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
	const id=req.params.id;
	const data=req.body
    try{
		if(req.files){
			const {before_cleaning, after_cleaning} = req.files;
			data.after_cleaning = after_cleaning ? after_cleaning[0].filename : null;
			data.before_cleaning = before_cleaning ? before_cleaning[0].filename : null;
		}
		
        const Isdata=await MonthlyServiceModel.update(data,{
			where: {
				id: id
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

module.exports = {
	AddMonthlyService,
    GetAllMonthlyService,
	DeleteMonthlyService,
	UpdateMonthlyService
}
