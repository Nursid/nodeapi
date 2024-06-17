const db=require("../model/index")

const DepartmentModel=db.DepartmentsModel

const GetAllDepartments=async(req,res)=>{
    try{
        const data=await DepartmentModel.findAll();
        if(!data){
            res.status(204).json({error: true, message:"Not found data"});
        }
        res.status(200).json(data);

    }catch(error){
        res.status(400).json({message:"Invalid url"});
    }
}
module.exports={GetAllDepartments}