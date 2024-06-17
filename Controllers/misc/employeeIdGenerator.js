// const EmpID = require("../../Models/misc/empId");

const db= require("../../model/index")

const EmpID = db.EmpID


const generateEmployeeId = async () => {

    let SeqData;
    SeqData = await EmpID.findOneAndUpdate(
        {},
        { $inc: { seq: 1 } },
        { new: true }
    );

    if (!SeqData) {
        SeqData = await new EmpID({
            id: "EMP",
            seq: 1
        }).save()
    }
    SeqData.seq++;
    return `EMP${SeqData.seq.toString().padStart(4, '0')}`;
}

module.exports = generateEmployeeId

