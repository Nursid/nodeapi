// const HeadExpModel = require("../../Models/ExpenseModels/AddHeadExpenseModel");

const db=require("../../model/index")
const HeadExpModel= db.HeadExpModel



const AddHeadExpense = async (req, res) => {
  const formData = req.body;
  try {
    // check in the db
    const isAdded = await HeadExpModel.findOne({ where:{name: formData.name} });
    if (isAdded){
      return res.status(409).json({ error: true, message: "Already Registered" });
    }
     
    // save the data on the dp
    const result = await HeadExpModel.create(formData)
    if (!result){
      return res.status(400).json({ error: true, message: "Not Added Facing Issue Try Again" });

    }
      
    // else return the dat
    res.status(200).json({
      error: false,
      message: "Add Successfully",
      data:result
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
// get all
const GetAll = async (req, res) => {
  try {
    const result = await HeadExpModel.findAll();
    if (!result){
      return res.status(404).json({ error: true, message: "No Data Found" });
    }
    res.status(200).json({ error: false, data: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const UpadateHeadExpense = async (req, res) => {

  console.log(req.body)
  try {
    const id = req.params.id;
    
    const result = await HeadExpModel.update(req.body, {
      where:{
        id:id
      }
    });
    if (!result){
      return res.status(400).json({ error: true, message: "NO Data Found" });
    }
    res.status(200).json({ error: false, message: "Updated Successfully"  });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// delete by id
const DeleteById = async (req, res) => {
  try{
  const id = req.params.id;

  console.log(id)
  // delete the data
  const isDeleted = await HeadExpModel.destroy({where:{id:id}})
    if(!isDeleted){
      res.status(409).json({ error: true, message: "No Data Found" });
    }
      res.status(200).json({ error: false, data:isDeleted, message: "Deleted Successfully" });
  }
    catch(error) {
      res.status(500).json({ error: true, error });
    };
};



module.exports = {
  AddHeadExpense,
  DeleteById,
  GetAll,
  UpadateHeadExpense,
};
