const db = require("../../model/index");

const TestiMonialsModel = db.TestiMonialsModel

const AddCustomerTestimonial= async (req, res) => {
    try {
        const data = req.body;
        if(req.files){
            const {image} = req.files;
            data.image = image ? image[0].filename : null;
        }
        
        
        const newPost = await TestiMonialsModel.create(data);
        return res.status(200).json({ status: true, message: "Testimonials Successfully Added!", data: newPost });
        
    } catch (error) {
        console.error("Error in adding customer post:", error);
        return res.status(500).json({ status: false, message: "Internal Error",error });
    }
}

const UpdateCustomerTestimonial = async (req, res) => {
    try {
        const id= req.params.id
        const {image} = req.files;
        const data = req.body;

        const IsTest= await TestiMonialsModel.findOne({where:{id:id}})

        if(image){
            data.image = image ? image[0].filename : null;
        }else{
            data.image = IsTest.image; 
        }
        
        const newPost = await TestiMonialsModel.update(data,{
            where:{
                id:id
            }
        });
        return res.status(200).json({ status: true, message: "Testimonials Successfully Updated!", data: newPost });
        
    } catch (error) {
        console.error("Error in adding customer post:", error);
        return res.status(500).json({ status: false, message: "Internal Error" });
    }
}

const GetAllTestimonials= async (req, res)=>{
     try{

        const data=await TestiMonialsModel.findAll();
        if(!data){
            return res.status(202).json({error: true, message: "No user found"})
        } 

         return res.status(200).json({error: false, data: data})

     }catch(error){
        return res.status(500).json({message:"Internal Error"})
     }
}

const DeleteTestimonials = async (req, res)=>{
    const id=req.params.id

    try{

        const isDeleted = await TestiMonialsModel.destroy({where:{id:id}})
        if(!isDeleted){
            return res.status(202).json({error: true, message: "No User Found"})
        }
        return res.status(200).json({error: false, message: "Deleted Successfully!"})

    }catch(error){
        return res.status(200).json({error: true, message: "Internal Error"});
    }
}

const BlockUpdate = async (req,res)=>{

    const id=req.params.id

    try{
        const is_block = req.body;
		const isBlock = await TestiMonialsModel.update(is_block, {
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

const ApprovedTestimonialUpdate= async (req, res)=>{
    const id=req.params.id

    try{
        const is_Approved = req.body;
		const isBlock = await TestiMonialsModel.update(is_Approved, {
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



module.exports = {GetAllTestimonials,DeleteTestimonials,BlockUpdate,AddCustomerTestimonial,UpdateCustomerTestimonial,ApprovedTestimonialUpdate}