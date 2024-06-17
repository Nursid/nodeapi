const axios = require("axios");
// const VerifyModel = require("./../Models/VerifyModel");

const db=require("../model/index")

const VerifyModel =db.VerifyModel

function generateOTP() {
  // Generate a random number between 1000 and 9999
  const otp = Math.floor(Math.random() * 9000) + 1000;
  return otp;
}

const msgFormat = (number, otp) => {
  const query = {
    key: "564E06C89106D7",
    campaign: "11704",
    routeid: "37",
    type: "text",
    contacts: number,
    senderid: "AIRCAM",
    template_id: "1207161520274849189",
    msg: `Dear Customer your OTP is - ${otp} Please do not share your OTP anyone.`,
  };

  // Convert it to the query string
  const queryString = new URLSearchParams(query).toString();
  return queryString;
};

module.exports = async (req, res) => {
  try {
    const { number } = req.params;

    const otp = generateOTP();
    const generatedString = msgFormat(number, otp);

    const smsApiUrl = "http://byebyesms.com/app/smsapi/index.php?";
    const response = await axios.get(smsApiUrl + generatedString);

    if (response.status === 200) {
      const data = {
        otp: otp,
        otpid: response.data,
        otpExpireTime: Date.now() + 40000,
      }
    const isReqStored = await VerifyModel.create(data);
    if (!isReqStored) {
      return res
        .status(400)
        .json({ error: true, message: "Failed to send OTP" });
    }
    res.status(200).json({
      error: false,
      message: "OTP sent successfully",
      data: isReqStored.otpid,
    });
}
}catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
