const addItemInfo = require("../../../utils/addItemInfo");
const connectToDatabase = require("../../../utils/dbConnect");

export default async function add(req,res) {
    let itemInfo;
    if(!req.query) {
        return res.status(400).json(null);
    }
    try {
        await connectToDatabase();
        itemInfo = await addItemInfo(req.query.itemId);
        console.log("added item: ", itemInfo.name);
    }
    catch (error) {
        console.log(error);
    }
    res.json(itemInfo);
}
  