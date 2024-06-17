const db = require("../../model/index");
const ServiceProviderModel = db.ServiceProviderModel;
const SpServicesModel = db.SpServices
const {isOptValid} = require("../utils");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Add the Service Provider
const AddServiceProvider = async (req, res) => {

	const formData = req.body;
	
	const SpServiceData = JSON.parse(formData.multiServices);
	const { image, document1,document2,document3} = req.files;

	formData.image = image ? image[0].filename : null;
	formData.document1 = document1 ? document1[0].filename : null;
	formData.document2 = document2 ? document2[0].filename : null;
	formData.document3 = document3 ? document3[0].filename : null;

	// Check if the service provider is already registered
	
	try { // Register the service provider

		const isUser = await ServiceProviderModel.findOne({
			where: {
				mobile_no: formData.mobile_no
			}
		});
	
		if (isUser) {
			 res.status(409).json({error: true, message: "User Already Registered with this Mobile No."});
		}
		const CreateServiceProvider = await ServiceProviderModel.create(formData);

		if (! CreateServiceProvider) {
			 res.status(400).json({error: true, message: "Not Register Please Try Again"});
		}

		const addService = await Promise.all(
			SpServiceData.map(async (service) => {
				console.log(service);  // Logging the service name
				return SpServicesModel.create({
					service_name: service,  // Directly use the string
					mobile_no: formData.mobile_no,
				});
			})
		);

		res.status(200).json({status: true, data: "Add Service Provider Successfully!"});
	} catch (error) {
		console.error(error);
		res.status(500).json({error});
	}
};
// Login THe service provder
const LoginServiceProvider = async (req, res) => {
    const { number, otp, otpid } = req.query;
    try {
        if (!number || !otp || !otpid) {
            return res.status(400).json({ error: true, message: "Invalid Credentials" });
        }

        // Check if OTP is valid
        const isVerified = await isOptValid(otp, otpid); // You need to implement isOtpValid function
        if (!isVerified) {
            return res.status(400).json({ error: true, message: "Otp Invalid or Expired" });
        }

        // Find the user by mobile number
        var user = await ServiceProviderModel.findOne({ where: { mobile_no: number } });
		
		user.role="Service Provider"

        if (!user) {
            return res.status(404).json({ error: true, message: "No user found" });
        }

        // Serialize the user object to remove sensitive data
        // const userWithoutPassword = user.toJSON();
        const userWithoutPassword =user.password;

        // Generate JWT token
        const token = jwt.sign(userWithoutPassword, process.env.SECRET_CODE);
        res.header("access-token", token);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
};


// Update the data
const UpdateTheServiceProvider = async (req, res) => {
	const updatedData = req.body;
	const id = req.params.id;
	// const SpServiceData = JSON.parse(updatedData.multiServices);

	try {
		const isUpdated = await ServiceProviderModel.update(updatedData,{
			where:{
				id:id
			}
		});
		if (! isUpdated) {
			return res.status(400).json({error: true, message: "Updation Failed Retry"});
		}
		// const isDeleted = await SpServiceData.destroy({
		// 	where:{
		// 		mobile_no: updatedData.mobile_no
		// 	}
		// })

		// const addService = await Promise.all(
		// 	SpServiceData.map(async (service) => {
		// 		console.log(service);  // Logging the service name
		// 		return SpServicesModel.create({
		// 			service_name: service,  // Directly use the string
		// 			mobile_no: updatedData.mobile_no,
		// 		});
		// 	})
		// );

		res.status(200).json({error: false, data: "Updated Service Provider"});
	} catch (error) {
		res.status(500).json({error});
	}
};
// delete the data by id
const DeleteTheServiceProvider = async (req, res) => {
	const id = req.params.id;

	try { // find the user and delete
		const isDeleted = await ServiceProviderModel.destroy({
			where: {
				id: id
			}
		});

		if (! isDeleted){ 
			return res.status(400).json({error: true, message: "Not deleted try Again"});
		}
		res.status(200).json({error: false, message: "Deleted Successfully"});
	} catch (error) {
		res.status(500).json({error});
	}
};
// Delete all
const BlockServiceProvider = async (req, res) => {
	const id = req.params.id
	try {
		const block_id = req.body;

		const data = await ServiceProviderModel.update(block_id, {
			where: {
				id: id
			}
		});
		if (data) {
			res.status(200).json({status: true, message: "Blocked Successfully"})
		}
	} catch (error) {
		res.status(200).json({error: false, message: "Internal Server Error "});
	}
};
// get all the service provider
const GetAllTheServiceProvider = async (req, res) => {
	try {
		const result = await ServiceProviderModel.findAll({
			include: [{	
				model: SpServicesModel,
				attributes: ['service_name'] 
			}],
			order:[['id','DESC']],
		});
		if (!result){
			return res.status(400).json({error: true, message: "No Data Found"});
		}
		res.status(200).json({error: false, data: result});
	} catch (error) {
		res.status(500).json({error});
	}
};
// get data by id
const GetDataById = async (req, res) => {
	const id = req.params.id;

	try {
		const result = await ServiceProviderModel.findById(id);
		if (! result) 
			return res.status(404).json({error: true, message: "No User Found"});
		


		res.status(200).json({error: false, data: result});
	} catch (error) {
		res.status(500).json({error});
	}
};

module.exports = {
	AddServiceProvider,
	LoginServiceProvider,
	UpdateTheServiceProvider,
	DeleteTheServiceProvider,
	BlockServiceProvider,
	GetAllTheServiceProvider,
	GetDataById
};
