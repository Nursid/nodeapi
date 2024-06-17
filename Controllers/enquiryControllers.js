const EnquiryModel = require("../model/enquirymodel");




// register Enquiry 

const GetRegEnquiry = async (req, res) => {
    const formdata = req.body;

    try {
        const isSubmit = await new EnquiryModel(formdata).save()
        if (!isSubmit) return res.status(400).json({ error: true, message: "failed ! try again" })

        res.status(200).json({ error: false, message: 'enquiry submit successfully', data: isSubmit })
    } catch (error) {
        res.status(500).json({ error })
    }
}


const GetUpdateEnquiry = async (req, res) => {
    const id = req.params.id

    try {
        const isupdated = await EnquiryModel.findByIdAndUpdate(id, {
            ...req.body,
        })
        if (!isupdated) return res.status(400).json({ error: true, message: "please check the info ! try again " })
        res.status(200).json({ error: false, data: isupdated })
    } catch (error) {
        res.status(500).json({ error })
    }
}


// delete the enquiry
const DeleteEnquiryByID = (req, res) => {
    const enquiryID = req.body.id

    EnquiryModel.deleteOne(enquiryID).then(() => {
        res.status(200).json({ error: false, message: "deleted successfully" })
    }).catch((err) => {
        res.status(500).json({ err })
    })
}


// get all enquiry 
const GetAllEnquiry = async (req, res) => {
    try {
        const allEnq = await EnquiryModel.find({})
        if (!allEnq) return res.status(404).json({ error: true, message: 'no data found' })

        res.status(200).json({ error: false, data: allEnq })
    } catch (error) {
        res.status(500).json({ error })
    }
}



module.exports = { GetRegEnquiry, GetUpdateEnquiry, DeleteEnquiryByID, GetAllEnquiry }