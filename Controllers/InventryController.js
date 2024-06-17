const db=require("../model/index")

const InventoryModel=db.InventoryModel
const AllotItemsModel=db.AllotedItemsModel

const AddInventory = async (req, res)=> {
    try{
        const data=req.body;
        const isAdd= await InventoryModel.create(data);
        if(!isAdd){
            res.status(202).json({status: true,message:"Inventory Not Added!"});
        }
        res.status(200).json({status: true, message:"Inventory Added Successfully!"});

    }catch(error){
        res.status(400).json({status: true ,message:"Internal Server Error"});
    }
}

const UpdateItems = async (req, res)=> {
    try{
        const item_id=req.params.id
        const data=req.body;
        
        const isAdd= await InventoryModel.update(data,
            {
             where: {
                    id: item_id
                }
            });
        if(!isAdd){
            res.status(202).json({status: true,message:"Inventory Not Added!"});
        }
        res.status(200).json({status: true, message:"Inventory Updated Successfully!"});

    }catch(error){
        res.status(400).json({status: true ,message:"Internal Server Error"});
    }
}

const GetAllInventry=async(req,res)=>{
    try{
        const data=await InventoryModel.findAll();
        if(!data){
            res.status(204).json({error: true, message:"Not found data"});
        }
        res.status(200).json(data);

    }catch(error){
        res.status(400).json({message:"Invalid url"});
    }
}
const GetAllAllotItems=async(req,res)=>{
    try{
        const data=await AllotItemsModel.findAll();
        if(!data){
            res.status(204).json({error: true, message:"Not found data"});
        }
        res.status(200).json({status: true,data:data});

    }catch(error){
        res.status(400).json({message:"Invalid url"});
    }
}



const DeleteItems=async(req,res)=>{
    try{
        const id = req.params.id

        const data=await InventoryModel.destroy({
            where: {
                id: id
            }
        });
        if(!data){
            res.status(204).json({error: true, message:"Not found data"});
        }
        res.status(200).json({status: true,message: "Items Deleted Successfull!"});

    }catch(error){
        res.status(400).json({message:"Invalid url"});
    }
}



const AllotedItems = async (req, res)=> {
    try{
        const data=req.body;
        
        const isAdd= await AllotItemsModel.create(data);
        if(!isAdd){
            res.status(202).json({status: true,message:"Inventory Not Added!"});
        }
        res.status(200).json({status: true, message:"Inventory Alloted Successfully!"});

    }catch(error){
        res.status(400).json({status: true ,message:"Internal Server Error"});
    }
}

module.exports={GetAllInventry,GetAllAllotItems,DeleteItems,AddInventory,UpdateItems,AllotedItems}