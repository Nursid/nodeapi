// const ServiceModal = require("../../Models/ServiceModal/ServiceModal")

const db = require("../../model/index")
const ServiceModal = db.ServiceModel

const AddService = async (req, res) => {
    const data = req.body;
    
    if (req.files) {
        const { icon, image } = req.files;
        data.icon = icon ? icon[0].filename : null;
        data.image = image ? image[0].filename : null;
    }
    
    // Store the data to the Database
    try {
        // Check if service already exists
        const existingService = await ServiceModal.findOne({ where: { serviceName: req.body.serviceName } });
        
        if (existingService) {
            return res.status(409).json("Service Already Registered");
        }
        
        // If service does not exist, create a new one
        const newService = await ServiceModal.create(data);
        
        res.status(200).json({
            error: false,
            data: newService,
            message: "Service Added Successfully!"
        });
        
    } catch (error) {
        console.error("Error occurred while adding service:", error);
        res.status(500).json({
            error: true,
            message: "Failed to add service",
            details: error.message // Optionally include more details about the error
        });
    }
};
const GetAllServices = async (req, res) => {

    try {
        // get all the services 
        const AllServices = await ServiceModal.findAll({
            order: [
                ['id', 'DESC']
              ]
        })
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
        const id = req.params.id
        // get all the services 
        const AllServices = await ServiceModal.findAll({
            where:{
                service_role: id
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

const DeleteByID = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the data is in the database and delete it
        const result = await ServiceModal.destroy({
            where: {
                id: id
            }
        });

        if (result === 0) {
            return res.status(400).json("Service Not Deleted");
        }

        res.status(200).json("Successfully deleted");
    } catch (error) {
        res.status(500).json({
            error: error.message // Improved error handling
        });
    }
};

const UpdateService = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        // Check if req.files exists and update data accordingly
        if (req.files) {
            const { icon, image } = req.files;

            if (icon && icon.length > 0 && icon[0].filename) {
                data.icon = icon[0].filename;
            }

            if (image && image.length > 0 && image[0].filename) {
                data.image = image[0].filename;
            }
        }

        // Update the service in the database
        const [rowsUpdated] = await ServiceModal.update(data, {
            where: { id: id }
        });

        if (rowsUpdated === 0) {
            return res.status(404).json({ error: true, message: 'Service not found or not updated' });
        }

        // Fetch the updated service after successful update
        const updatedService = await ServiceModal.findByPk(id);

        res.status(200).json({
            error: false,
            data: updatedService,
            message: 'Service updated successfully'
        });
    } catch (error) {
        console.error('Failed to update service:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to update service'
        });
    }
};

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





module.exports = { AddService, GetAllServices, UpdateService, GetSingleServiceData, DeleteByID, GetTheService,BlockUpdate }


