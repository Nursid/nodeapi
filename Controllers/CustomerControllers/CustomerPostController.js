const Sequelize = require("sequelize")
const {param} = require("../../Routers/Verify");
const db = require("../../model/index");

const CustomerPost=db.CustomerPost;

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


module.exports = {
    AddCustomerPost
}