// const AddCollectionModel = require("../../Models/ExpenseModels/AddCollection");

const db= require("../../model/index")

const AddCollectionModel = db.AddCollectionModel

const AddCollection = async (req, res) => {
    const formData = req.body;
    try {
        const existingData = await AddCollectionModel.findOne({ where: { orderNo: formData.orderNo } });
        
        if (existingData) {
           return  res.status(202).json({ error: true, message: "Already Registered" });
        }
        // Save the data in the database
        const result = await AddCollectionModel.create(formData);
        if (!result) {
             res.status(400).json({ error: true, message: "Not Added Facing Issue Try Again" });
        }
        // Return the data
     return res.status(200).json({error: false,data: result });
    } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
    }
};
const GetAllCollections = async (req, res) => {
    try {
        const result = await AddCollectionModel.findAll()
        if (!result) return res.status(404).json({ error: true, message: "No Data Found" })

        res.status(200).json({ error: false, data: result })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}
// update the collection data
const UpdateCollectionData = async (req, res) => {
    try {
        const id = req.body._id
        const result = await AddCollectionModel.findByIdAndUpdate(id, req.body, { new: true })
        if (!result) return res.status(404).json({ error: true, message: "NO Data Found" })

        res.status(200).json({ error: false, data: result })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

// delete by id 
const DeleteCollectionByID = async (req, res) => {
    const id = req.params.id
    // delete the data 

    AddCollectionModel.findByIdAndDelete(id).then(() => {
        res.status(200).json({ error: false, message: "Deleted Successfully" })
    }).catch((error) => {
        res.status(500).json({ error: true, error })
    })
}

// delete all the expenses head
const DeletaAllCollections = async (req, res) => {
    // delete the data 

    AddCollectionModel.deleteMany({}).then(() => {
        res.status(200).json({ error: false, message: "Deleted Successfully" })
    }).catch((error) => {
        res.status(500).json({ error: true, error })
    })
}



module.exports = { AddCollection, GetAllCollections, DeleteCollectionByID, DeletaAllCollections, UpdateCollectionData }