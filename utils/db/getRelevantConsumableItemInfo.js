const Item = require("../../models/item");

module.exports = async function getAllConsumableItemInfo() {
  try{
    const results = await Item.find({itemClass: "Consumable"});
    return results;
  }
  catch (error) {
    return error;
  }
}