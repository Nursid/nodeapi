const db=require("../model/index")

const DesignationModel=db.DesignationModel

const GetAllDesignation=async(req,res)=>{
    try{
        const data=await DesignationModel.findAll();
        if(!data){
            res.status(204).json({error: true, message:"Not found data"});
        }
        res.status(200).json(data);

    }catch(error){
        res.status(400).json({message:"Invalid url"});
    }
}
module.exports={GetAllDesignation}