const Item = require("../models/item");

module.exports = async function getSearchItemInfo(searchInput) {
  try{
    const results = await Item.find({name:{'$regex' : 'Living Ruby', '$options' : 'i'}});
    return results;
  }
  catch (error) {
    console.log('Error getting data', error);
  }
}