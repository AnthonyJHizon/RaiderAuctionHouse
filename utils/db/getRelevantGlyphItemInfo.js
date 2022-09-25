const Item = require("../../models/item");

module.exports = async function getAllGlyphItemInfo() {
  try{
    const results = await Item.find({itemClass: "Glyph"});
    return results;
  }
  catch (error) {
    return error;
  }
}