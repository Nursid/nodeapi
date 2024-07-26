const db=require("../model/index")

const EnquiryModel=db.EnquiryModel


// register Enquiry 
const createEnquiry = async (req, res) => {
  const formData = req.body;

  try {
    const existingEnquiry = await EnquiryModel.findOne({
      where: {
        mobileNo: formData?.mobileNo
      }
    });

    if (existingEnquiry) {
      return res.status(200).json({ status: false, message: 'Enquiry already exists with this mobile number' });
    }

    const newEnquiry = await EnquiryModel.create(formData);
    res.status(200).json({ status: true, message: 'Thank you for your enquiry. We appreciate your interest and will respond promptly.', data: newEnquiry });  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateEnquiry = async (req, res) => {
    const id = req.params.id;
    const formData = req.body;
  
    try {
      const updatedEnquiry = await EnquiryModel.update(formData, {
        where: { id: id }
      });
      
      if (updatedEnquiry[0] === 0) {
        return res.status(404).json({ error: true, message: 'No user found' });
      }
  
      res.status(200).json({ error: false, message: 'Enquiry updated successfully' });
    } catch (error) {
      res.status(500).json({ error });
    }
  };


// delete the enquiry
const deleteEnquiryByID = async (req, res) => {
    const id = req.params.id; // Assuming id is part of URL params
  
    try {
      const deletedEnquiryCount = await EnquiryModel.destroy({
        where: { id: id }
      });
  
      if (deletedEnquiryCount === 0) {
        return res.status(404).json({ error: true, message: 'Enquiry not found' });
      }
  
      res.status(200).json({ error: false, message: 'Enquiry deleted successfully' });
    } catch (error) {
      res.status(500).json({ error });
    }
  };

// get all enquiry 
const getAllEnquiries = async (req, res) => {
    try {
      const allEnquiries = await EnquiryModel.findAll({
        order: [
          ['id', 'DESC']
        ]
      });
  
      if (!allEnquiries || allEnquiries.length === 0) {
        return res.status(404).json({ error: true, message: 'No enquiries found' });
      }
  
      res.status(200).json({ error: false, data: allEnquiries });
    } catch (error) {
      res.status(500).json({ error });
    }
  };



module.exports = { createEnquiry, updateEnquiry, deleteEnquiryByID, getAllEnquiries }