const db = require("../../model/index")

const LocationModel = db.locality;

const ListingLocation = async (req, res) => {

	try {

		const data = await LocationModel.findAll({attributes: ["location_name"]});

        if(!data){
            res.status(200).json({status: false, message: "Location Not Found"})
        }
        res.status(200).json({status: true, data: data})
	} catch (error) {
		res.status(500).json({status: false, message: "Internal Server Error"})
	}
}

module.exports= {
    ListingLocation
}