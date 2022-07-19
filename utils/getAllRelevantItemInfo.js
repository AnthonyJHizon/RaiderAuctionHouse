const getRelevantGemItemInfo = require("./getRelevantGemItemInfo");
const getRelevantConsumableItemInfo = require("./getRelevantConsumableItemInfo");
const getRelevantTradeGoodItemInfo = require("./getRelevantTradeGoodItemInfo");
const connectToDatabase = require("./dbConnect");

export default async function getRelevevantItems() {
    try {
        await connectToDatabase();
        const gemItemData = await getRelevantGemItemInfo();
        const consumableItemData = await getRelevantConsumableItemInfo();
        const tradeGoodItemData = await getRelevantTradeGoodItemInfo();

        let relevantItemData = {};
        let relevantItems = {};
        let relevantItemInfo = {};
        let relevantGems = {};
        let relevantConsumables = {};
        let relevantTradeGoods = {};
        let gemSubclasses = {};
        let consumableSubclasses = {};
        let tradeGoodSubclasses = {};
    
        gemItemData.forEach((gem) => {
          if(gem.itemLevel >= 70)
          {
            relevantGems[gem._id] = gem.itemSubclass;
            relevantItemInfo[gem._id] = {
              "name": gem.name,
              "icon": gem.iconURL,
            }
          }
          if(!gemSubclasses[gem.itemSubclass])
          {
            gemSubclasses[gem.itemSubclass] = gem.itemClass
          }
        })
        consumableItemData.forEach((consumable) => {
          if(consumable.itemLevel >= 60)
          {
            relevantConsumables[consumable._id] = consumable.itemSubclass;
            relevantItemInfo[consumable._id] = {
              "name": consumable.name,
              "icon": consumable.iconURL
            }
          }
          if(!consumableSubclasses[consumable.itemSubclass])
          {
            consumableSubclasses[consumable.itemSubclass] = consumable.itemClass 
          }
        })
        tradeGoodItemData.forEach((tradeGood) => {
          if(tradeGood.itemLevel >= 60)
          {
            relevantTradeGoods[tradeGood._id] = tradeGood.itemSubclass;
            relevantItemInfo[tradeGood._id] = {
              "name": tradeGood.name,
              "icon": tradeGood.iconURL
            }
          }
          if(!tradeGoodSubclasses[tradeGood.itemSubclass])
          {
            tradeGoodSubclasses[tradeGood.itemSubclass] = tradeGood.itemClass;  
          }
        })
    
        relevantItems["gems"] = relevantGems;
        relevantItems["consumables"] = relevantConsumables;
        relevantItems["tradeGoods"] =  relevantTradeGoods;
        relevantItems["gemSubclasses"] = gemSubclasses;
        relevantItems["consumableSubclasses"] = consumableSubclasses;
        relevantItems["tradeGoodSubclasses"] = tradeGoodSubclasses;
        relevantItems["itemClasses"] = ["Gems","Consumables","Trade Goods"];
        relevantItemData["relevantItems"] = relevantItems;
        relevantItemData["relevantItemInfo"] = relevantItemInfo;
        return relevantItemData;
    }
    catch (error) {
        return error;
    }
}