const Item = require("../models/item");

module.exports = async function getAllGemItemInfo() {
  try{
    const results = await Item.find({itemClass: "Gem"});
    return results;
  }
  catch (error) {
    console.log('Error getting data', error);
  }
}