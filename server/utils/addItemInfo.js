const axios = require('axios');
const getAccessToken = require('./getAccessToken')
const Item = require('../models/item');

module.exports = async function addItemInfo(itemId) {
  let item = null;
  try{
    const accessToken = await getAccessToken();
    const itemDataResponse = await axios.get(`https://us.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US&access_token=${accessToken}`);
    const nameResult = itemDataResponse.data.name;
    const levelReq = itemDataResponse.data.required_level;
    const itemLevel = itemDataResponse.data.level;
    const itemClass = itemDataResponse.data.item_class.name;
    const itemSubclass = itemDataResponse.data.item_subclass.name;
    const itemEquip = itemDataResponse.data.inventory_type.name;
    const itemQuality = itemDataResponse.data.quality.name;
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
          const itemDataResponse = await axios.get(`https://us.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US&access_token=${newAccessToken}`);
          const nameResult = itemDataResponse.data.name;
          const levelReq = itemDataResponse.data.required_level;
          const itemLevel = itemDataResponse.data.level;
          const itemClass = itemDataResponse.data.item_class.name;
          const itemSubclass = itemDataResponse.data.item_subclass.name;
          const itemEquip = itemDataResponse.data.inventory_type.name;
          const itemQuality = itemDataResponse.data.quality.name;
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
      else if (error.response.status === 429) { //going over api call limit of 100/second
        setTimeout(() => {  
          addItemInfo(itemId)
         }, 1500);
         console.log("waiting");
      }
      else { //unknown error
        console.log(error.response) 
      }
    }
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