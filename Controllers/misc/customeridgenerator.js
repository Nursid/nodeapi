// const CustomerID = require("../../Models/misc/customerId");

const db= require("../../model/index")
const CustomerID = db.CustomerID

const generateCustomerID = async () => {

    let SeqData;
    SeqData = await CustomerID.findOneAndUpdate(
        {},
        { $inc: { seq: 1 } },
        { new: true }
    );

    if (!SeqData) {
        SeqData = await new CustomerID({
            id: "HM",
            seq: 11000
        }).save()
    }
    SeqData.seq++;
    return `HM${SeqData.seq.toString().padStart(4, '0')}`;
}

module.exports = generateCustomerID

