require("dotenv").config();
const db = require("../model/index");
const Contact = db.contact;

const contact = async (req, res) => {
  try {
    const data = req.body;
    const Isdata = await Contact.create(data);
    if (!Isdata) {
      res.status(200).json({
        status: false,
        message: "An error occured",
      });
    }
    res.status(200).json({
      status: true,
      data:Isdata,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      status: false,
    });
  }
};


const GetAllContact = async (req, res) => {
  try {

    const Isdata = await Contact.findAll();
    if (!Isdata) {
      res.status(202).json({
        status: false,
        message: "An error occured",
      });
    }
    res.status(200).json({
      status: true,
      data:Isdata,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      status: false,
    });
  }
};


module.exports = {
  contact,
  GetAllContact
};
