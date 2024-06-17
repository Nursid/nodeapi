const db = require("../../model/index");

const MonthlyServiceModel = db.MonthlyServiceModel
const CustomerModel = db.NewCustomerModel;

const AddMonthlyService = async (req, res) => {
	const data = req.body;
	try { // Example code:
		const UserId = await CustomerModel.findOne({
			where: {
				mobileno: data.mobile_no
			}
		});
		if (! UserId) {
			return res.status(404).json({status: 404, message: "This Customer not Exist"});
		}
		data.user_id = UserId.id
		// Example code to create a new record in MonthlyServiceModel:
		const newData = await MonthlyServiceModel.create({
			...data
		});
		if (! newData) {
			return res.status(404).json({status: 404, message: "Invalid error"});
		}
		return res.status(200).json({status: 200, message: newData,message:"Monthly Service Added!"});
	} catch (error) { // If any error occurs, respond with an error message
		return res.status(500).json({error: true, message: "Internal Server Error"});
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
