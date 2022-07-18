const getSearchedItemInfo = require('../../../utils/getSearchedItemInfo');
const connectToDatabase = require("../../../utils/dbConnect");

export default async function handler(req,res) {
  if(!req.query) {
    res.status(400).json({erorr: "Bad Request"});
  }
  try {
    await connectToDatabase();
    let searchItems = {};
    const searchItemData = await getSearchedItemInfo(req.query.item);
    searchItemData.forEach((item) => {
      searchItems[item._id] = {
        "name": item.name,
        "icon": item.iconURL
      }
    })
    res.status(200).json(searchItems);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({error: "Server Error"});
  } 
}