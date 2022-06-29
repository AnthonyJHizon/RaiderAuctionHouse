const getSearchedItemInfo = require('../../../utils/getSearchedItemInfo');
const connectToDatabase = require("../../../utils/dbConnect");

export default async function getSearchedItems(req,res) {
    await connectToDatabase();
    let searchItems = {};
    if(!req.query) {
        return res.status(400).json(null);
    }
    try {
        const searchItemData = await getSearchedItemInfo(req.query.submitSearchInput);
        searchItemData.forEach((item) => {
        searchItems[item._id] = item.name ;
        })
    }
    catch (error) {
        console.log(error);
    } 
    return res.json(searchItems)
}