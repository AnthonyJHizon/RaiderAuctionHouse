const Item = require("../models/item");

module.exports = async function getItem(itemId) {
  try{
    const results = await Item.findById(itemId);
    if(results === null) {
      return null
    }
    else
    {
      return results;
    }
  }
  catch (error) {
    console.log('Error getting data', error);
  }
}