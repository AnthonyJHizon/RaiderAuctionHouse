const Item = require("../../models/item");

module.exports = async function getSearchItemInfo(searchInput) {
  try{
    searchInput = searchInput.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const results = await Item.find({name:{$regex: searchInput, $options: 'i' }});
    return results;
  }
  catch (error) {
    return error;
  }
}