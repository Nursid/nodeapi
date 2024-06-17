const db = require("../../model/index");

const MemberModels = db.MemberModels

const GetMember = async (req, res) => {

	try {

		const data = await MemberModels.findAll();

		res.status(200).json({status: 200, data: data});
	} catch (error) {
		res.status(400).json({status: false, message: "It is Internal Probelm"})
	}
}

module.exports = {
	GetMember
}
