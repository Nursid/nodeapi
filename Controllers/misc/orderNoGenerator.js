// const OrderNo = require("../../Models/misc/orderNo");

const db= require("../../model/index")

const OrderNo = db.OrderNo

const generateOrderNo = async () => {

    let SeqData;
    SeqData = await OrderNo.findOneAndUpdate(
        {},
        { $inc: { seq: 1 } },
        { new: true }
    );

    if (!SeqData) {
        SeqData = await new OrderNo({
            id: "ORD",
            seq: 48000
        }).save()
    }
    SeqData.seq++;
    return `ORD${SeqData.seq.toString().padStart(4, '0')}`;
}

module.exports = generateOrderNo
