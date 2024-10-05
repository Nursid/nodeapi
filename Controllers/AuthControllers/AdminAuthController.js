const db = require("../../model/index");
const AdminModel = db.AdminModel;
const ejs = require("ejs");
const path = require("path")
// const jwt = require("jsonwebtoken");
const Transporter = require("../../helpers/mail")
const VerifyModel = db.VerifyModel
const jwt = require('jsonwebtoken');
const {isEmail, isMobileNumber} = require("../utils");
require('dotenv').config();
const {Op, where} = require('sequelize');
const bcrypt = require('bcrypt');

// Add the admin
const createTheAdmin = async (req, res) => {
	const formData = req.body;

	try { // Check if a super admin is already registered
		const isReg = await AdminModel.findOne({
			where: {
				email: formData.email
			}
		});

		if (isReg) {
			return res.status(409).json({error: true, message: "Admin is Already Registered"});
		}

		// Create the admin
		const newCreated = await AdminModel.create(formData);

		if (! newCreated) {
			return res.status(400).json({error: true, message: "Not registered! Try Again"});
		}

		res.status(200).json({error: false, data: newCreated});
	} catch (error) {
		console.error(error);
		res.status(500).json({error: true, message: "Internal Server Error"});
	}
};
const loginAdmin = async (req, res) => {
	const formData = req.body;

	try { // Find the data type user email or mobile no
		const dataType = isEmail(formData.email) ? 'email' : isMobileNumber(formData.email) ? 'mobileNo' : 'Invalid Credential';

		if (dataType === 'Invalid Credential') {
			return res.status(400).json({error: true, message: 'Please Enter the Valid Email Or Mobile Number'});
		}

		const checkField = {
			[dataType]: formData.email
		};

		// Find the user
		const isUser = await AdminModel.findOne({where: checkField});

		if (! isUser) {
			return res.status(404).json({error: true, message: 'No user found'});
		}

		// Compare the password using bcrypt or a secure password hashing library
		// For simplicity, let's assume a direct comparison here (which is not recommended in production)
		// const compare = isUser.password === formData.password;
		const isMatch = await bcrypt.compare(formData.password, isUser.password );

		if (! isMatch) {
			return res.status(401).json({error: true, message: 'Invalid Password'});
		}

		// Generate the jwt token
		const token = jwt.sign({
			... isUser.get()
		}, process.env.SECRET_CODE);
		res.header('access-token', token);
		// Remove the password from the response
		const userDataWithoutPassword = {
			... isUser.get(),
			password: undefined,
			token: token
		};
		res.status(200).json(userDataWithoutPassword);

	} catch (error) {
		console.error(error);
		res.status(500).json({error});
	}
};
// Update the Admin Details
const updateAdmin = async (req, res) => {
	const email = req.params.id;

	try {
		const isUpdated = await AdminModel.update(req.body, {where: {
				id
			}});

		if (! isUpdated) 
			return res.status(400).json({error: true, message: "No updated"});
		


		res.status(200).json({error: false, data: isUpdated});
	} catch (error) {
		res.status(500).json({error});
	}
};
const ForgetPassword = async (req, res) => {

	const email = req.body.email;

	try {

		function generateOtp() {
			const otp = Math.floor(100000 + Math.random() * 900000);
			return otp;
		}

		const currentDate = new Date();
		const otpExpireTime = new Date(currentDate.getTime() + 10 * 60 * 1000);

		const otp = generateOtp();

		const isAdmin = await AdminModel.findOne({
			where: {
				email: email
			}
		});

		if (! isAdmin) {
			return res.status(200).json({status: false, message: 'No Admin found'});
		}

		const data = {
			otp: otp,
			otpid: otp + email,
			otpExpireTime: otpExpireTime.toISOString() 
		}

		const isReqStored = await VerifyModel.create(data);
		if (! isReqStored) {
			return res.status(200).json({status: false, message: 'OTP Not Match'});
		}

		const templatePath = path.join(__dirname, '../../helpers/otp_template.ejs');


		const emailData = await ejs.renderFile(templatePath, {otp: isReqStored.otp.toString()});

		Transporter.transporter.sendMail({from: "nursid299@gmail.com", to: email, subject: "OTP to Forgot Password", html: emailData});

		res.status(200).json({status: true, message: "OTP has been sent"})

	} catch (error) {
		res.status(500).json({
			status: false,
			message: "Internal Server Error!" + error
		});
	}
}
const VerifyPassword = async (req, res) => {
	try {
		const otp = req.body.otp;
		const otpid = req.body.otpid;
		const currentDate = new Date();

		const isVerify = await VerifyModel.findOne({
			where: {
				otp: otp,
				otpid: otpid,
				otpExpireTime: {
					[Op.gt]: currentDate
				}
			}
		});

		if (! isVerify) {
			return res.status(200).json({status: false, message: "Otp Not Match!"})
		}

		res.status(200).json({status: true, message: "Successfully Varified"})

	} catch (error) {
		res.status(500).json({
			status: false,
			message: "Internal Server Error!" + error
		})
	}
}
const ResetPassword = async (req, res) => {
	try {
		const email = req.body.email;
        const password = req.body.password;

		// Check if email and password are provided
		if (!email || !password) {
			return res.status(400).json({ status: false, message: "Email and password are required!" });
		}

		const isAdmin = await AdminModel.findOne({
			where: {
				email: email
			}
		});

		if (!isAdmin) {
			return res.status(404).json({ status: false, message: "User Not Found!" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		const [isReset] = await AdminModel.update(
			{ password: hashedPassword },
			{ where: { email: email } }
		);

		if (isReset === 0) {
			return res.status(500).json({ status: false, message: "Password does not reset!" });
		}

		res.status(200).json({ status: true, message: "Successfully Password Reset!", isReset });

	} catch (error) {
		res.status(500).json({
			status: false,
			message: "Internal Server Error! " + error.message
		});
	}
};

const PasswordReset = async (req, res) => {
	try {
		const data = req.body;
        

		// Check if email and password are provided
		if (!data?.currentPassword) {
			return res.status(202).json({ status: false, message: "Current password is required!" });
		}
		
		if (!data?.password) {
			return res.status(202).json({ status: false, message: "New password is required!" });
		}
		
		if (!data?.confirmPassword) {
			return res.status(202).json({ status: false, message: "Confirm password is required!" });
		}

		const isAdmin = await AdminModel.findOne({
			where: {
				email: data?.email
			}
		});

		const isMatch = await bcrypt.compare(data.currentPassword, isAdmin.password );

		if (!isMatch) {
			return res.status(202).json({error: true, message: 'Current password is incorrect!'});
		}


		// Hash the new password
		const hashedNewPassword = await bcrypt.hash(data.password, 10);

		// Update the password in the database
		await AdminModel.update(
			{ password: hashedNewPassword },
			{ where: { email: data?.email } } 
		);

		res.status(200).json({ status: true, message: "Password successfully reset!" });

	} catch (error) {
		res.status(500).json({
			status: false,
			message: "Internal Server Error! " + error.message
		});
	}
};

module.exports = {
	createTheAdmin,
	loginAdmin,
	updateAdmin,
	ForgetPassword,
	VerifyPassword,
	ResetPassword,
	PasswordReset
};
