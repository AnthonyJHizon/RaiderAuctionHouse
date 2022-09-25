const Item = require('../../models/item');

module.exports = async function getItemAllInfo() {
  try{
    let allItemId = new Set();
    const results = await Item.find({});
    results.forEach((item) => {
        allItemId.add(item.id);
    })
    return allItemId;
  }
  catch (error) {
    console.log('Error getting data', error);
  }
}