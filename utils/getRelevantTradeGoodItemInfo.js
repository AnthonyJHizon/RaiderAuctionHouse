const Item = require("../models/item");

module.exports = async function getItemAllInfo() {
  try{
    const results = await Item.find({itemClass: "Trade Goods"});
    return results;
  }
  catch (error) {
    console.log('Error getting data', error);
  }
}