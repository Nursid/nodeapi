const db = require("../model")

const ComplainModel = db.ComplainModel
const NewCustomerModal = db.NewCustomerModel
const getAllComplains = async (req, res) => {
  try {
    const complains = await ComplainModel.findAll({
      include: [
				{
					model: NewCustomerModal,
				},
			],
        order: [
            ['id', 'DESC']
        ]
    });
    res.status(200).json({status: true, data: complains});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a complain by ID
const getComplainById = async (req, res) => {
  const { id } = req.params;
  try {
    const complain = await ComplainModel.findOne({
      where:{
        id: id
      }
    });
    if (!complain) {
      return res.status(404).json({ error: 'Complain not found' });
    }
    res.status(200).json({status: true, data:complain});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new complain
const createComplain = async (req, res) => {
  const data = req.body;
  try {
    const complain = await ComplainModel.create(data);
    res.status(200).json({status: true, message: "Complain Added Successfully!"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a complain by ID
const updateComplain = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    let complain = await ComplainModel.findOne({
      where: {
        id: id
      }
    });
    if (!complain) {
      return res.status(404).json({ error: 'Complain not found' });
    }
    complain = await complain.update(data,{
      where: {
        id: id
      }
    });
    res.status(200).json({status: true, message: "Complain Updated Successfully!"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a complain by ID
const deleteComplain = async (req, res) => {
  const { id } = req.params;
  try {
    const complain = await ComplainModel.findOne({
      where: {
        id: id
      }
    });
    if (!complain) {
      return res.status(404).json({ error: 'Complain not found' });
    }
    await complain.destroy({
      where: {
        id: id
      }
    });
    res.status(200).json({status: true, message: "Complain Deleted Successfully!"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const ComplainAssing = async (req, res) => {
	try {
		const id = req.params.id
		const data = req.body
		const isUpdated = await ComplainModel.update(data, {
			where: {
				id: id
			}
		})
		if (! isUpdated) {
			return res.status(400).json({error: true, message: 'Updation Failed ! Try again'})
		}
		res.status(200).json({status: 200, message: "Assign Successfull!"})
	} catch (error) {
		res.status(200).json("Internal Server Error");
	}
}

module.exports = {
  getAllComplains, createComplain, deleteComplain,getComplainById ,updateComplain,ComplainAssing
 }