const Item = require("../models/item");

module.exports = async function getItemAllInfo() {
  try{
    let allItemNameAndIcon = {};
    let allItemName = {};
    let allItemIcon = {}
    const results = await Item.find({});
    results.forEach((item) => {
        allItemName[item._id] = item.name
        allItemIcon[item._id] = item.iconURL
    })
    allItemNameAndIcon["names"] = allItemName;
    allItemNameAndIcon["icons"] = allItemIcon;
    return allItemNameAndIcon;
  }
  catch (error) {
    console.log('Error getting data', error);
  }
}