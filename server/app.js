require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');

const refreshToken = require('./utils/refreshToken');
const getAccessToken = require('./utils/getAccessToken');
const getItemInfo = require('./utils/getItemInfo');
const addItemInfo = require('./utils/addItemInfo');

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
  }
  catch (error) {
    if(error.response)
    {
      if(error.reponse.status === 401)
      {
        //assume access token expired
        const newAccessToken = refreshToken();
        try{
          const response = await axios.get(`https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&access_token=${newAccessToken}`);
          const results = response.data.results;
          results.forEach(result => {
            realmData.push({
              id: result.data.id,
              name: result.data.realms[0].name.en_US
            })
          });
        }
        catch (err) {
          console.log(err)
        }
      }
    }
  }
  res.json(realmData);
})

app.get('/api/auctions', async (req,res) => {
  let auctionData = {}
  if(!req.query) {
    return res.status(400).json(null);
  }
  try{
    const response = await axios.get(`https://us.api.blizzard.com/data/wow/connected-realm/${req.query.currRealm}/auctions/${req.query.currAH}?namespace=dynamic-classic-us&locale=en_US&access_token=${await getAccessToken()}`);
    const items = [];
    response.data.auctions.forEach(item => {
      items.push({
        id: item.item.id,
        buyout: item.buyout,
        quantity: item.quantity
      })
    })
    auctionData.lastModified = response.headers.date;
    auctionData.items = items;
  }
  catch (error) {
    if(error.response)
    {
      console.log(error);
      if(error.reponse.status === 401)
      {
        //assume access token expired
        const newAccessToken = refreshToken();
        try{
          const response = await axios.get(`https://us.api.blizzard.com/data/wow/connected-realm/${req.query.currRealm}/auctions/${req.query.currAH}?namespace=dynamic-classic-us&locale=en_US&access_token=${newAccessToken}`);
          const results = response.data.results;
          results.forEach(result => {
            realmData.push({
              id: result.data.id,
              name: result.data.realms[0].name.en_US
            })
        });
        }
        catch (err) {
          console.log(err)
        }
      }
    }
  }
  res.json(auctionData);
})

app.get('/api/itemInfo', async (req,res) => {
  let itemInfo = {};
  if(!req.query) {
    return res.status(400).json(null);
  }
  try{
    itemInfo = await getItemInfo(req.query.itemId)
    if(itemInfo === null)
    {
      itemInfo = await addItemInfo(req.query.itemId);
    }
  }
  catch (error) {
    console.log(error)
  }
  res.json(itemInfo);
})

app.listen(3000, () => {
  console.log('server started')
});