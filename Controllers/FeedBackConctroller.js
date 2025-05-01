const db = require("../model/index");

const FeedbackModel = db.FeedbackModel;

const AddFeedback = async (req, res) => {
    const { name, phoneNumber, address, serviceDetails, willCallBack, serviceRating, recommendation, helperRating } = req.body;

    try {
        const newFeedback = await FeedbackModel.create({
            name,
            phoneNumber,
            address,
            serviceDetails,
            willCallBack,
            serviceRating,
            recommendation,
            helperRating
        });

        res.status(201).json({ status: true, message: 'Feedback added successfully', data: newFeedback });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get all feedback
const GetAllFeedback = async (req, res) => {
    try {
        const feedbackList = await FeedbackModel.findAll();
        res.status(200).json({ status: true, data: feedbackList });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { AddFeedback, GetAllFeedback };