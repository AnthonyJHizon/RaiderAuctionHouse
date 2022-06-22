const getSearchedItemInfo = require('../../../utils/getSearchedItemInfo');
const connectToDatabase = require("../../../utils/dbConnect");

export default async function getSearchedItems(req,res) {
    let searchItems = {};
    console.log(req.query);
    if(!req.query) {
        return res.status(400).json(null);
    }
    try {
        await connectToDatabase();
        const searchItemData = await getSearchedItemInfo(req.query.submitSearchInput);
        searchItemData.forEach((item) => {
        searchItems[item._id] = item.name ;
        })
    }
    catch (error) {
        console.log(error);
    } 
    res.json(searchItems)
}