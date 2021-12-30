const axios = require('axios');
const getAccessToken = require('./getAccessToken')
const Item = require('../models/item');

module.exports = async function addItemInfo(itemId) {
  let item = null;
  try{
    const accessToken = await getAccessToken();
    const nameResponse = await axios.get(`https://us.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US&access_token=${accessToken}`);
    const nameResult = nameResponse.data.name;
    const levelReq = nameResponse.data.required_level;
    const itemLevel = nameResponse.data.level;
    const itemClass = nameResponse.data.item_class.name;
    const itemSubclass = nameResponse.data.item_subclass.name;
    const itemEquip = nameResponse.data.inventory_type.name;
    const itemQuality = nameResponse.data.quality.name;
    const iconResponse = await axios.get(`https://us.api.blizzard.com/data/wow/media/item/${itemId}?namespace=static-classic-us&locale=en_US&access_token=${accessToken}`);
    const iconResult = iconResponse.data.assets[0].value;
    item = {
      _id: itemId,
      name: nameResult,
      levelReq: levelReq,
      itemLevel: itemLevel,
      itemClass: itemClass,
      itemSubclass: itemSubclass,
      itemEquip: itemEquip,
      itemQuality: itemQuality,
      iconURL: iconResult
    };
  }
  catch (error) {
    if(error.response)
    {
      if(error.response.status === 401)
      {
        //assume access token expired
        const newAccessToken = refreshToken();
        try{
          const nameResponse = await axios.get(`https://us.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US&access_token=${newAccessToken}`);
          const nameResult = nameResponse.data.name;
          const levelReq = nameResponse.data.required_level;
          const itemLevel = nameResponse.data.level;
          const itemClass = nameResponse.data.item_class.name;
          const itemSubclass = nameResponse.data.item_subclass.name;
          const itemEquip = nameResponse.data.inventory_type.name;
          const itemQuality = nameResponse.data.quality.name;
          const iconResponse = await axios.get(`https://us.api.blizzard.com/data/wow/media/item/${itemId}?namespace=static-classic-us&locale=en_US&access_token=${newAccessToken}`);
          const iconResult = iconResponse.data.assets[0].value;
          item = {
            _id: itemId,
            name: nameResult,
            levelReq: levelReq,
            itemLevel: itemLevel,
            itemClass: itemClass,
            itemSubclass: itemSubclass,
            itemEquip: itemEquip,
            itemQuality: itemQuality,
            iconURL: iconResult
          };
        }
        catch (err) {
          console.log(err)
        }
      }
      else if(error.response.status === 404) //item was not found in api, make "Deprecated" item to add to Item
      {
        item = {
          _id: itemId,
          name: "Deprecated",
          levelReq: -1,
          itemLevel:-1,
          itemClass: "Deprecated",
          itemSubclass: "Deprecated",
          itemEquip: "Deprecated",
          itemQuality: "Deprecated",
          iconURL: "Deprecated"
        }
      }
    }
    console.log(error)
  }
  
  if(item) {
    try{
      await Item.create(item)
    }
    catch (error) {
      console.log(error);
    }
  }
  return item;
}