require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express(); //express app

app.use(cors());
app.use(cookieParser());
// app.use(bodyParser());

app.get('/', (req,res) => {
  res.send("123123");
})

app.get('/refresh', async (req,res) => {
  // curl -u {client_id}:{client_secret} -d grant_type=client_credentials https://us.battle.net/oauth/token
  const url = "https://us.battle.net/oauth/token";
  const params = new URLSearchParams ({
    grant_type: "client_credentials"
  })
  const authOptions = {
    auth: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    }
  }
  try{
  }
  catch (error) {
    console.log('Error getting data', error);
  }
})

app.get('/api/realms', async (req,res) => {
  let realmData = [];
  try{
    const response = await axios.get('https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&access_token=USUNyw6npvBOQThkPGHmOWggaRyfWdla4F');
    const results = response.data.results;
    results.forEach(result => {
      // console.log(result.data.realms[0].name.en_US);
      // console.log(result.data.id)
      realmData.push({
        id: result.data.id,
        name: result.data.realms[0].name.en_US
      })
    });
  }
  catch (error) {
    console.log('Error getting data', error);
  }
  res.json(realmData);
})

app.get('/api/auctions', async (req,res) => {
  let auctionData = {}
  if(!req.query) {
    return res.status(400).json(null);
  }
  try{
    const response = await axios.get(`https://us.api.blizzard.com/data/wow/connected-realm/${req.query.currRealm}/auctions/${req.query.currAH}?namespace=dynamic-classic-us&locale=en_US&access_token=USUNyw6npvBOQThkPGHmOWggaRyfWdla4F`);
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
    console.log('Error getting data', error);
  }
  res.json(auctionData);
})

app.listen(3000, () => {
  console.log('server started')
});