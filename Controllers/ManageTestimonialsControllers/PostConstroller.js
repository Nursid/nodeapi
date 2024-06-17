const db = require("../../model/index");

const CustomerPost = db.CustomerPost;

const AddCustomerPost = async (req, res) => {
    try {
        const {image} = req.files;
        const data = req.body;
        data.image = image ? image[0].filename : null;
        
        const newPost = await CustomerPost.create(data);
        return res.status(200).json({ status: true, message: "Customer Post Successfully Added!", data: newPost });
        
    } catch (error) {
        console.error("Error in adding customer post:", error);
        return res.status(500).json({ status: false, message: "Internal Error" });
    }
}

const UpdateCustomerPost = async (req, res) => {
    try {
        const id= req.params.id
        const {image} = req.files;
        const data = req.body;

        const IsTest= await CustomerPost.findOne({where:{id:id}})

        if(image){
            data.image = image ? image[0].filename : null;
        }else{
            data.image = IsTest.image; 
        }
        
        const newPost = await CustomerPost.update(data,{
            where:{
                id:id
            }
        });
        return res.status(200).json({ status: true, message: "Customer Post Successfully Updated!", data: newPost });
        
    } catch (error) {
        console.error("Error in adding customer post:", error);
        return res.status(500).json({ status: false, message: "Internal Error" });
    }
}

const GetAllPost= async (req, res)=>{
     try{

        const data=await CustomerPost.findAll();
        if(!data){
            return res.status(202).json({error: true, message: "No user found"})
        } 

         return res.status(200).json({error: false, data: data})

     }catch(error){
        return res.status(500).json({message:"Internal Error"})
     }
}
const BlockPostUpdate= async (req, res)=>{
    const id=req.params.id

    try{
        const is_block = req.body;
		const isBlock = await CustomerPost.update(is_block, {
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
const ApprovePostUpdate= async (req, res)=>{
    const id=req.params.id

    try{
        const is_block = req.body;
		const isBlock = await CustomerPost.update(is_block, {
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
const DeletePost = async (req, res)=>{
    const id=req.params.id

    try{

        const isDeleted = await CustomerPost.destroy({where:{id:id}})
        if(!isDeleted){
            return res.status(202).json({error: true, message: "No User Found"})
        }
        return res.status(200).json({error: false, message: "Deleted Successfully!"})

    }catch(error){
        return res.status(200).json({error: true, message: "Internal Error"});
    }
}



module.exports = {GetAllPost,BlockPostUpdate,DeletePost,ApprovePostUpdate,AddCustomerPost,UpdateCustomerPost}