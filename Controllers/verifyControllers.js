const axios = require("axios");
// const VerifyModel = require("./../Models/VerifyModel");

const db=require("../model/index")

const VerifyModel =db.VerifyModel

function generateOTP() {
  const otp = Math.floor(Math.random() * 9000) + 1000;
  return otp;
}

const msgFormat = (number, otp) => {
  const query = {
    username: "technicalmadhusudan",
    pass: "a12345678",
    route: "trans1",
    senderid: "INFOCS",
    ispreapproved: "1",
    numbers: number, // Assuming `number` is a variable holding the recipient's number
    message: `Welcome To HELPER. Please Share OTP For Checked in your OTP No is ${otp} CSPL`,
  };

  const queryString = new URLSearchParams(query).toString();
  return queryString;
};

module.exports = async (req, res) => {
  try {
    const { number } = req.params;

    const otp = generateOTP();
    const generatedString = msgFormat(number, otp);

    const smsApiUrl = "http://173.45.76.227/send.aspx?";
    const response = await axios.get(smsApiUrl + generatedString);

    if (response.status === 200) {
      const data = {
        otp: otp,
        otpid: response.data, // Assuming response.data contains the OTP ID
        otpExpireTime: Date.now() + 40000, // Set OTP expiry time (e.g., 40 seconds from now)
      };

      // Save OTP details to MongoDB using Mongoose model
      const isReqStored = await VerifyModel.create(data);

      if (!isReqStored) {
        return res.status(400).json({ error: true, message: "Failed to send OTP" });
      }

      res.status(200).json({
        error: false,
        message: "OTP sent successfully",
        data: isReqStored.otpid, // Assuming you want to return the OTP ID
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};



// const msgFormat = (number, otp) => {
//   const query = {
//     key: "564E06C89106D7",
//     campaign: "11704",
//     routeid: "37",
//     type: "text",
//     contacts: number,
//     senderid: "AIRCAM",
//     template_id: "1207161520274849189",
//     msg: `Dear Customer your OTP is - ${otp} Please do not share your OTP anyone.`,
//   };

//   // Convert it to the query string
//   const queryString = new URLSearchParams(query).toString();
//   return queryString;
// };

// module.exports = async (req, res) => {
//   try {
//     const { number } = req.params;

//     const otp = generateOTP();
//     const generatedString = msgFormat(number, otp);

//     const smsApiUrl = "http://byebyesms.com/app/smsapi/index.php?";
//     const response = await axios.get(smsApiUrl + generatedString);

//     if (response.status === 200) {
//       const data = {
//         otp: otp,
//         otpid: response.data,
//         otpExpireTime: Date.now() + 40000,
//       }
//     const isReqStored = await VerifyModel.create(data);
//     if (!isReqStored) {
//       return res
//         .status(400)
//         .json({ error: true, message: "Failed to send OTP" });
//     }
//     res.status(200).json({
//       error: false,
//       message: "OTP sent successfully",
//       data: isReqStored.otpid,
//     });
// }
// }catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: true, message: "Internal server error" });
//   }
// };
