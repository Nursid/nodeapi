// const AddExpenseModel = require("../../Models/ExpenseModels/AddExpenseModel");

const { where } = require("sequelize");
const db = require("../../model/index");
const AddExpenseModel = db.AddExpenseModel;
const HeadExpModel = db.HeadExpModel;


const AddExpense = async (req, res) => {
    const formData = req.body
    try {

        const result = await  AddExpenseModel.create(formData)
        if (!result) return res.status(400).json({ error: true, message: "Not Added Facing Issue Try Again" })

        // else return the dat 
        res.status(200).json({
            error: false,
            data: result
        })

    } catch (error) {
        res.status(500).json(error)
    }
}
// get all 
const GetAllExpense = async (req, res) => {
    try {

        const Allexpense = await AddExpenseModel.findAll();
			
		const result = await Promise.all(
			Allexpense.map(async (item) => {
				const headExp = await HeadExpModel.findOne({
					where: { id: item.expHead }
				});
				return { ...item.dataValues, headExp };
			})
		);



        // const result = await AddExpenseModel.findAll()
        if (!result) return res.status(404).json({ error: true, message: "No Data Found" })

        res.status(200).json({ error: false, data: result })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

const UpdateExpenseById = async (req, res) => {
    try {
        const id = req.body._id
        const result = await AddExpenseModel.update(req.body,{where:{ id: id }})
        if (!result) return res.status(400).json({ error: true, message: "Not Update Please Try Again" })

        res.status(200).json({ error: false, data: result })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}


// delete by id 
const DeleteExpById = async (req, res) => {
    const id = req.params.id
    // delete the data 
try{
    const DeleteExp=  await AddExpenseModel.destroy({where:{id:id}})
    if(!DeleteExp){
        res.status(400).json({ error: true, message: "Internal Server Error" })
    }
    res.status(400).json({ error: true, message: "Deleted Successfullyr" })
   
    }
    catch(error){
        res.status(500).json({ error: true, error })
    }
}




module.exports = { AddExpense, GetAllExpense, DeleteExpById, UpdateExpenseById }