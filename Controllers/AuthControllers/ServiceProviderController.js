const db = require("../../model/index");
const ServiceProviderModel = db.ServiceProviderModel;
const SpServicesModel = db.SpServices
const EmployeeModel = db.EmployeeModel
const NewCustomerModel = db.NewCustomerModel
const Availability = db.Availability
const {isOptValid} = require("../utils");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Op } = require('sequelize');

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
			 res.status(200).json({status: false, message: "User Already Registered with this Mobile No."});
		}

		
		const isSupervisor = await EmployeeModel.findOne({
			where:{
				mobile_no: formData.mobile_no
			}
		})

		if (isSupervisor) {
			return res.status(200).json({status:false, message: 'User Already Exists as Supervisor!'});
		}

		const isCustomer = await NewCustomerModel.findOne({
			where:{
				mobileno: formData.mobile_no
			}
		});

		if (isCustomer) {
			return res.status(200).json({status:false, message: 'Mobile No. Already Exists in Customer!'});
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

		res.status(200).json({status: true, message: "Add Service Provider Successfully!"});
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
// const UpdateTheServiceProvider = async (req, res) => {
//     const updatedData = req.body;
//     const id = req.params.id;
//     const { image, document1, document2, document3 } = req.files;

//     // Update file names in updatedData if files exist
//     updatedData.image = image ? image[0].filename : null;
//     updatedData.document1 = document1 ? document1[0].filename : null;
//     updatedData.document2 = document2 ? document2[0].filename : null;
//     updatedData.document3 = document3 ? document3[0].filename : null;

//     try {
//         // Update main service provider data
//         const [rowsUpdated, [updatedServiceProvider]] = await ServiceProviderModel.update(updatedData, {
//             where: { id: id },
//             returning: true, // Return the updated row
//         });

//         if (rowsUpdated !== 1) {
//             return res.status(400).json({ error: true, message: "Updation Failed. Retry." });
//         }

//         // Handle related services
//         if (updatedData.multiServices) {
//             const SpServiceData = JSON.parse(updatedData.multiServices);

//             // Delete existing services
//             await SpServicesModel.destroy({
//                 where: {
//                     mobile_no: updatedServiceProvider.mobile_no // Assuming mobile_no is a unique identifier
//                 }
//             });

//             // Add new services
//             const addService = await Promise.all(SpServiceData.map(async (service) => {
//                 return SpServicesModel.create({
//                     service_name: service,
//                     mobile_no: updatedServiceProvider.mobile_no
//                 });
//             }));
//         }

//         res.status(200).json({ error: false, message: "Service Provider Updated Successfully" });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error });
//     }
// };

const UpdateTheServiceProvider = async (req, res) => {
    const emp_id = req.params.id;
    const data = req.body;

    try {
        // Check if employee exists
        const isEmployee = await ServiceProviderModel.findOne({
            where: {
                id: emp_id
            }
        });

        if (!isEmployee) {
            return res.status(404).json({ status: false, message: "Service Provider not found!" });
        }

		const isSupervisor = await EmployeeModel.findOne({
			where:{
				mobile_no: data.mobile_no
			}
		})

		if (isSupervisor) {
			return res.status(200).json({status:false, message: 'User Already Exists as Supervisor!'});
		}

		const isCustomer = await NewCustomerModel.findOne({
			where:{
				mobileno: data.mobile_no
			}
		});

		if (isCustomer) {
			return res.status(200).json({status:false, message: 'Mobile No. Already Exists in Customer!'});
		}

        // Handle file uploads if present
        if (req.files) {
            const { image, document1, document2, document3 } = req.files;

            if (image && image[0]?.filename) {
                data.image = image[0].filename;
            }

            if (document1 && document1[0]?.filename) {
                data.document1 = document1[0].filename;
            }

            if (document2 && document2[0]?.filename) {
                data.document2 = document2[0].filename;
            }
            if (document3 && document3[0]?.filename) {
                data.document3 = document3[0].filename;
            }
        }

        // Update employee data
        const updateResult = await ServiceProviderModel.update(data, {
            where: {
                id: emp_id
            }
        });

        if (!updateResult || updateResult[0] === 0) {
            return res.status(400).json({ status: false, message: "Service provider not updated!" });
        }

        // Delete existing services
        const existingServices = await SpServicesModel.findAll({
            where: {
                mobile_no: data.mobile_no 
            }
        });

        if (existingServices.length > 0) {
            await SpServicesModel.destroy({
                where: {
                    mobile_no: data.mobile_no
                }
            });
        }

        // Add new services
        if (data.multiServices) {
            const SpServiceData = JSON.parse(data.multiServices);
            const addService = await Promise.all(SpServiceData.map(async (service) => {
                return SpServicesModel.create({
                    service_name: service,
                    mobile_no: data.mobile_no
                });
            }));
        }

        return res.status(200).json({ status: true, message: "Service Provider updated successfully!" });
    } catch (error) {
        return res.status(500).json({ status: false, message: `Internal Server Error: ${error.message}` });
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
	const data = req.query;

	try {
		
		
		
		const result = await ServiceProviderModel.findAll({
			include: [{	
			  model: SpServicesModel,
			  attributes: ['service_name'] 
			}],
			order: [['id', 'DESC']],
		  });

		  if (!data || !data.date || !data.time_range) {
			return res.status(200).json({error: false, data: result});
		}
		  
		  const Available = await Availability.findAll({
			attributes: ['emp_id'],
			where: {
			  date: data.date,
			  [data.time_range]: "p"
			}
		  });
		  
		  const availableEmpIds = Available.map(entry => entry.dataValues.emp_id);
		  const serviceProvider = result
				.filter(entry => entry.dataValues.block_id !== 1)
				.map(entry => entry.dataValues);
	
		const filterData = serviceProvider.filter(item => availableEmpIds.includes(item.id.toString()));

		if (filterData.length === 0){
			return res.status(202).json({error: true, message: "No Data Found"});
		}
		res.status(200).json({error: false, data: filterData});
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
