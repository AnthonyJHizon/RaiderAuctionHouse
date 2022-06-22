const getAllItemInfo = require('../../../utils/getAllItemInfo');
const connectToDatabase = require("../../../utils/dbConnect");

export default async function getAllItems(req,res) {
    await connectToDatabase();
    let allItemNameAndIcon = {};
    try {
        const startTime = Date.now();
        const allItemInfoData = await getAllItemInfo();
        let allItemName = {};
        let allItemIcon = {}
        allItemInfoData.forEach((item) => {
            allItemName[item._id] = item.name
            allItemIcon[item._id] = item.iconURL
    })
    const endTime = Date.now();
    allItemNameAndIcon["names"] = allItemName;
    allItemNameAndIcon["icons"] = allItemIcon;
    console.log(`Elapsed time ${endTime - startTime}`)
    }
    catch (error) {
        console.log(error)
    }
    res.json(allItemNameAndIcon);
}