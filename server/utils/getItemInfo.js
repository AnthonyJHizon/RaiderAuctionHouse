const Item = require("../models/item");

module.exports = async function getItemInfo() {
  try{
    const results = await Item.find({});
    return results;
  }
  catch (error) {
    console.log('Error getting data', error);
  }
}