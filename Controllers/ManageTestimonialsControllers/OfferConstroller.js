const db = require("../../model/index");

const OfferModel= db.OfferModel;



const AddCustomerOffer = async (req, res) => {
    try {
        const {image} = req.files;
        const data = req.body;
        data.image = image ? image[0].filename : null;
        
        const newPost = await OfferModel.create(data);
        return res.status(200).json({ status: true, message: "Customer Offer Successfully Added!", data: newPost });
        
    } catch (error) {
        console.error("Error in adding customer post:", error);
        return res.status(500).json({ status: false, message: "Internal Error" });
    }
}

const UpdateCustomerOffer = async (req, res) => {
    try {
        const id= req.params.id
        const {image} = req.files;
        const data = req.body;

        const IsTest= await OfferModel.findOne({where:{id:id}})

        if(image){
            data.image = image ? image[0].filename : null;
        }else{
            data.image = IsTest.image; 
        }
        
        const newPost = await OfferModel.update(data,{
            where:{
                id:id
            }
        });
        return res.status(200).json({ status: true, message: "Customer Offer Successfully Updated!", data: newPost });
        
    } catch (error) {
        console.error("Error in adding customer post:", error);
        return res.status(500).json({ status: false, message: "Internal Error" });
    }
}

const GetAllOffer= async (req, res)=>{
    try{

       const data=await OfferModel.findAll();
       if(!data){
           return res.status(202).json({error: true, message: "No user found"})
       } 

        return res.status(200).json({error: false, data: data})

    }catch(error){
       return res.status(500).json({message:"Internal Error"})
    }
}


const BlockOfferUpdate= async (req, res)=>{
    const id=req.params.id

    try{
        const is_block = req.body;
		const isBlock = await OfferModel.update(is_block, {
			where: {
				id: id
			}
		});

        if(!isBlock){
            return res.status(202).json({error: true, message: "No User Found"})
        }
        return res.status(200).json({error: false, data: isBlock})

    }catch(error){
        return res.status(200).json({error: true, message: "Internal Error"});
    }
}
const ApprovedOfferUpdate= async (req, res)=>{
    const id=req.params.id

    try{
        const is_Approved = req.body;
		const isBlock = await OfferModel.update(is_Approved, {
			where: {
				id: id
			}
		});

        if(!isBlock){
            return res.status(202).json({error: true, message: "No User Found"})
        }
        return res.status(200).json({error: false, data: isBlock})

    }catch(error){
        return res.status(200).json({error: true, message: "Internal Error"});
    }
}
const DeleteOffer = async (req, res)=>{
    const id=req.params.id

    try{

        const isDeleted = await OfferModel.destroy({where:{id:id}})
        if(!isDeleted){
            return res.status(202).json({error: true, message: "No User Found"})
        }
        return res.status(200).json({error: false, message: "Deleted Successfully!"})

    }catch(error){
        return res.status(200).json({error: true, message: "Internal Error"});
    }
}


module.exports = {
    GetAllOffer,
    BlockOfferUpdate,
    DeleteOffer,
    ApprovedOfferUpdate,
    AddCustomerOffer,
    UpdateCustomerOffer
}