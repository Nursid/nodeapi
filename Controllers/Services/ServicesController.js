// const ServiceModal = require("../../Models/ServiceModal/ServiceModal")

const db = require("../../model/index")
const ServiceModal = db.ServiceModel

const AddService = async (req, res) => {

    // Store the data to the Database
    try {
        //  check the service is alereay register or not
        const isService = await ServiceModal.findOne({ serviceName: req.body.serviceName })
        if (isService) return res.status(409).json("Service Already Registered");

        // if not then store the data 
        const NewService = await new ServiceModal(req.body).save()
        res.status(200).json({
            error: false,
            data: NewService
        })

    } catch (error) {
        res.status(500).json({
            error: true,
            message: error,
        })
    }
}
const GetAllServices = async (req, res) => {

    try {
        // get all the services 
        const AllServices = await ServiceModal.findAll()
        if (!AllServices) return res.status(400).json("No data Found")

        res.status(200).json({
            status: 200,
            data: AllServices
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            error: error
        })
    }
}
const GetSingleServiceData = async (req, res) => {

    try {
        const service_role = req.params.id
        // get all the services 
        const AllServices = await ServiceModal.findAll({
            where:{
                service_role: service_role
            }
        })
        if (!AllServices) return res.status(200).json("No data Found")

        res.status(200).json({
            status: true,
            data: AllServices
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal Server "+error.message
        })
    }
}
const DeleteServices = async (req, res) => {
    try {
        const id = req.body._id

        // check is the data in db
        const result = await ServiceModal.findByIdAndDelete(id)
        if (result.deletedCount === 0) return res.status(400).json("Service Not Deleted")

        res.status(200).json("successfully deleted")
    } catch (error) {
        res.status(500).json({
            error: error,
        })
    }
}
const DeleteByID = async (req, res) => {
    try {
        const id = req.params.id

        // check is the data in db
        const result = await ServiceModal.findByIdAndDelete(id)
        if (result.deletedCount === 0) return res.status(400).json("Service Not Deleted")

        res.status(200).json("successfully deleted")
    } catch (error) {
        res.status(500).json({
            error: error,
        })
    }
}
// update the services
const UpdateService = async (req, res) => {

    try {
        // service id  
        const Id = req.body._id

        // find the service and update it 
        const UpdateService = await ServiceModal.findByIdAndUpdate(Id, req.body, { new: true })
        if (!UpdateService) return res.status(400).json({ error: true, message: "Service not Updated " })

        res.status(200).json({
            error: false,
            data: UpdateService
        })

    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}
const GetTheService = async (req, res) => {

    const { serviceName } = req.query;

    const search = {}


    if (serviceName) {
        search.serviceName = { $regex: serviceName, $options: "i" }
    }



    try {
        const response = await ServiceModal.findOne(search)
        if (!response) return res.status(404).json({ error: true, message: "No Service Found" })

        res.status(200).json({ error: false, data: response })
    } catch (error) {
        res.status(500).json({ error })
    }
}
const BlockUpdate = async (req,res)=>{

    const id=req.params.id

    try{
        const is_block = req.body;
		const isBlock = await ServiceModal.update(is_block, {
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





module.exports = { AddService, GetAllServices, DeleteServices, UpdateService, GetSingleServiceData, DeleteByID, GetTheService,BlockUpdate }


