require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');


const refreshToken = require('./utils/refreshToken');
const getAccessToken = require('./utils/getAccessToken');
const getAllItemInfo = require('./utils/getAllItemInfo'); //returns all item info in our colleciton
const addItemInfo = require('./utils/addItemInfo');
const getAllGemItemInfo = require('./utils/getAllGemItemInfo');
const getAllConsumableItemInfo = require('./utils/getAllConsumableItemInfo');
const getAllTradeGoodItemInfo = require('./utils/getAllTradeGoodItemInfo')

//set up db
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  await refreshToken();
  console.log("connected to db and refreshed token")
}).catch((error) => console.log(error))

const app = express(); //express app

app.use(cors());
app.use(cookieParser());
// app.use(bodyParser());

app.get('/', (req,res) => {
  res.send("123123");
})

app.get('/api/realms', async (req,res) => {
  let realmData = [];
  try{
    const response = await axios.get(`https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&access_token=${await getAccessToken()}`);
    const results = response.data.results;
    results.forEach(result => {
      realmData.push({
        id: result.data.id,
        name: result.data.realms[0].name.en_US
      })
    });
    realmData.sort((a,b) => a.name.localeCompare(b.name)) //sort alphabetically
  }
  catch (error) {
    if(error.response)
    {
      if(error.response.status === 401)
      {
        //assume access token expired
        const newAccessToken = await refreshToken();
        try{
          const response = await axios.get(`https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&access_token=${newAccessToken}`);
          const results = response.data.results;
          results.forEach(result => {
            realmData.push({
              id: result.data.id,
              name: result.data.realms[0].name.en_US
            })
          });
          // realmData.sort((a,b) => a.name.localeCompare(b.name)) //sort alphabetically
        }
        catch (err) {
          console.log(err)
        }
      }
    }
    console.log(error)
  }
  res.json(realmData);
})

app.get('/api/auctions', async (req,res) => {
  let auctionData = {}
  let econnreset = false;
  let limit = 0;
  if(!req.query) {
    return res.status(400).json(null);
  }
  do{
    try{
      const startTime = Date.now();
      const response = await axios.get(`https://us.api.blizzard.com/data/wow/connected-realm/${req.query.realmKey}/auctions/${req.query.ahKey}?namespace=dynamic-classic-us&access_token=${await getAccessToken()}`);
      const minPriceHash = {};
      response.data && response.data.auctions && response.data.auctions.forEach(item => {
        if(!minPriceHash[item.item.id] && item.buyout > 0){
          minPriceHash[item.item.id] = item.buyout/item.quantity/10000
        }
        else{
          if(minPriceHash[item.item.id] > item.buyout/item.quantity/10000 && item.buyout > 0) //sometimes buyout is = 0
          {
            minPriceHash[item.item.id] = item.buyout/item.quantity/10000
          }
        }
      })
      auctionData.lastModified = response.headers.date;
      auctionData.items = minPriceHash
      const endTime = Date.now();
      console.log(`Elapsed time ${endTime - startTime}`)
      econnreset = false;
    }
    catch (error) {
      if(error.response)
      {
        if(error.response.status === 401)
        {
          //assume access token expired
          const newAccessToken = await refreshToken();
          try{
            const response = await axios.get(`https://us.api.blizzard.com/data/wow/connected-realm/${req.query.realmKey}/auctions/${req.query.ahKey}?namespace=dynamic-classic-us&access_token=${newAccessToken}`);
            const minPriceHash = {};
            auctionData.total = response.data.auctions.length;
            response.data && response.data.auctions && response.data.auctions.forEach(item => {
              if(!minPriceHash[item.item.id] && item.buyout > 0){
                minPriceHash[item.item.id] = item.buyout/item.quantity/10000
              }
              else{
                if(minPriceHash[item.item.id] > item.buyout/item.quantity/10000 && item.buyout > 0) //sometimes buyout is = 0
                {
                  minPriceHash[item.item.id] = item.buyout/item.quantity/10000
                }
              }
            })
            auctionData.items = minPriceHash;
            auctionData.lastModified = response.headers.date;
            econnreset = false;
          }
          catch (err) {
            console.log(err.response.status)
          }
        }
        else
        {
          console.log(error.response.status);
        }
      }
      else if (error.code) //most likely econnreset
      {
        if(error.code === "ECONNRESET")
        {
          limit++; //give up when limit is > 10
          console.log("econnreset");
          econnreset = true;
        }
      }
      else //unknown error
      {
        console.log(error)
      }
    }
  } while(econnreset && limit < 10);
  res.json(auctionData);
})

app.get('/api/allItemInfo', async (req,res) => {
  let allItemNameAndIcon = {};
  try {
    const startTime = Date.now();
    allItemInfoData = await getAllItemInfo();
    let allItemName = {};
    let allItemIcon = {}
    allItemInfoData.forEach((item) => {
      allItemName[item._id] = item.name
      allItemIcon[item._id] = item.iconURL
    })
    const endTime = Date.now();
    allItemNameAndIcon["names"] = allItemName;
    allItemNameAndIcon["icons"] = allItemIcon;
    console.log(`Elapsed time ${endTime - startTime}`)
  }
  catch (error) {
    console.log(error)
  }
  res.json(allItemNameAndIcon);
})

app.get('/api/addItem', async (req,res) => {
  let itemInfo;
  if(!req.query) {
    return res.status(400).json(null);
  }
  try {
    itemInfo = await addItemInfo(req.query.itemId);
    console.log("added item: ", itemInfo.name);
  }
  catch (error) {
    console.log(error);
  }
  res.json(itemInfo);
})

app.get('/api/getRelevantItems', async (req,res) => {
  let relevantItems = {};
  try {
    const gemItemData = await getAllGemItemInfo();
    const consumableItemData = await getAllConsumableItemInfo();
    const tradeGoodItemData = await getAllTradeGoodItemInfo();
  
    let relevantGems = {};
    let relevantConsumables = {};
    let relevantTradeGoods = {};
    let gemSubclasses = {};
    let consumableSubclasses = {};
    let tradeGoodSubclasses = {};

    gemItemData.forEach((gem) => {
      relevantGems[gem._id] = gem.itemSubclass;
      if(!gemSubclasses[gem.itemSubclass])
      {
        gemSubclasses[gem.itemSubclass] = gem.itemClass
      }
    })
    consumableItemData.forEach((consumable) => {
      relevantConsumables[consumable._id] =  consumable.itemSubclass;
      if(!consumableSubclasses[consumable.itemSubclass])
      {
        consumableSubclasses[consumable.itemSubclass] = consumable.itemClass 
      }
    })
    tradeGoodItemData.forEach((tradeGood) => {
      relevantTradeGoods[tradeGood._id] = tradeGood.itemSubclass;
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
    // console.log(relevantItems["itemClasses"]);
    // console.log(relevantItems["gemSubclasses"]);

  }
  catch (error) {
    console.log(error);
  }
  res.json(relevantItems);
})

app.listen(3000, () => {
  console.log('server started')
});