const getRelevantGemItemInfo = require("../../../utils/getRelevantGemItemInfo");
const getRelevantConsumableItemInfo = require("../../../utils/getRelevantConsumableItemInfo");
const getRelevantTradeGoodItemInfo = require("../../../utils/getRelevantTradeGoodItemInfo");
const connectToDatabase = require("../../../utils/dbConnect");

export default async function getRelevevantItems(req,res) {
    let relevantItems = {};
    try {
        await connectToDatabase();
        const gemItemData = await getRelevantGemItemInfo();
        const consumableItemData = await getRelevantConsumableItemInfo();
        const tradeGoodItemData = await getRelevantTradeGoodItemInfo();
    
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
          }
          if(!gemSubclasses[gem.itemSubclass])
          {
            gemSubclasses[gem.itemSubclass] = gem.itemClass
          }
        })
        consumableItemData.forEach((consumable) => {
          if(consumable.itemLevel >= 60)
          {
            relevantConsumables[consumable._id] =  consumable.itemSubclass;
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
        relevantItems["itemClasses"] = ["Gems","Consumables","Trade Goods"]
    }
    catch (error) {
        console.log(error);
    }
    res.json(relevantItems);
}