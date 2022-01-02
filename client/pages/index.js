import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react'


export default function Home({content}) {
  const {realms, auctionHouses, data, allItemInfo, relevantItems} = content;
  const {gems, consumables, tradeGoods, gemSubclasses, consumableSubclasses, tradeGoodSubclasses, itemClasses} = relevantItems;
  const {names, icons} = allItemInfo;

  const [realm, setRealm] = useState(4728); //default realm set to benediction
  const [auctionHouse, setAH] = useState(2); //default ah set to alliance
  const [listings, setListings] = useState(data[realm][auctionHouse].items);
  const [itemClassFilter, setItemClassFilter] = useState(consumables);
  const [itemSubclassFilter, setItemSubclassFilter] = useState("Flask");
  const [lastModified, setLastMod] = useState(data[realm][auctionHouse].lastModified);

  // const [totalItems, setTotalItems] = useState();
  // const [uniqueCount, setUniqueCount] = useState();
  // const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    async function setData(){
      setLastMod(data[realm][auctionHouse].lastModified);
      setListings(data[realm][auctionHouse].items);
  }
  setData();
  },[realm, auctionHouse]);

  // console.log(itemClassFilter);
  // console.log(itemSubclassFilter);
  // console.log(names);
  // console.log(realms)
  // console.log(auctionHouse)
  // console.log(data)
  // console.log(relevantItems);
  // console.log(gems);
  // console.log(consumables);

  let realmsArr = [];
  const realmKeys = Object.keys(realms);
  realmKeys.forEach((realmKey) => {
    realmsArr.push(
      <div key = {realms[realmKey]} onClick={() => setRealm(realmKey) }>{realms[realmKey]}</div>
    )
  })
  realmsArr.sort((a,b) => a.key.localeCompare(b.key)); //sort the array based on div key which is the name of the realm

  let ahArr = [];
  const ahKeys = Object.keys(auctionHouses);
  ahKeys.forEach((ahKey) => {
    ahArr.push(
      <div key = {ahKey} onClick={() => setAH(ahKey) }>{auctionHouses[ahKey]}</div>
    )
  })

  let filterArr = [];
  // console.log(itemClasses);
  // console.log(consumableSubclasses);
  // console.log(gems);
  filterArr.push(
    <div key = "All Items" className= {styles.dropdown}>
      <button className = {styles.dropbtn} onClick={() => {setItemClassFilter(), setItemSubclassFilter()}}>All Items</button>
    </div>
  )
  itemClasses.forEach( (itemClass) => {
    let subclassArr = [];
    let subclasses = {};
    let itemClassFilter = {};
    switch (itemClass)
    {
      case "Gems":
        subclasses = gemSubclasses;
        itemClassFilter = gems;
        break;
      case "Consumables":
        subclasses = consumableSubclasses;
        itemClassFilter = consumables;
        break;
      case "Trade Goods":
        subclasses = tradeGoodSubclasses;
        itemClassFilter = tradeGoods;
        break;
    }
    Object.keys(subclasses).forEach( (subclass) => {
      subclassArr.push(
        <div key = {subclass} onClick={() => {setItemSubclassFilter(subclass), setItemClassFilter(itemClassFilter)} }>{subclass}</div>
      )
    })
    subclassArr.sort((a,b) => a.key.localeCompare(b.key));
    filterArr.push (
      <div key = {itemClass} className= {styles.dropdown}>
        <button className = {styles.dropbtn} onClick={() => {setItemClassFilter(itemClassFilter), setItemSubclassFilter()}}>
          {itemClass}
        </button>
        <div className={styles.dropdownContent}>
            {subclassArr}
          </div>
      </div>
    )
  })

  let postsArr = [];
  if(listings) {
    Object.keys(listings).forEach( async (item) => {
      if(item)
      {
        if(names[item])
        {
          if(names[item] !== "Deprecated")
          {
            if(itemClassFilter && itemSubclassFilter)
            {
              if(itemClassFilter[item] === itemSubclassFilter)
              {
                postsArr.push(
                <div key = {item} id = {names[item]} className= {styles.postsContainer}> 
                  <a href={"https://tbc.wowhead.com/item="+item}><img src={icons[item]}/></a>
                  <a className = {styles.itemName} href={"https://tbc.wowhead.com/item="+item}>{names[item]}</a>
                  <p>Buyout Price: {intToGold(listings[item].toFixed(4))}</p> 
                </div>)
              }
            }
            else if(itemClassFilter)
            {
              if(itemClassFilter[item])
              {
                postsArr.push(
                <div key = {item} id = {names[item]} className= {styles.postsContainer}>
                  <a href={"https://tbc.wowhead.com/item="+item}><img src={icons[item]}/></a>
                  <a className = {styles.itemName} href={"https://tbc.wowhead.com/item="+item}>{names[item]}</a>
                  <p>Buyout Price: {intToGold(listings[item].toFixed(4))}</p> 
                </div>)
              }
            }
            else
            {
              postsArr.push(
              <div key = {item} id = {names[item]} className= {styles.postsContainer}>
                <a href={"https://tbc.wowhead.com/item="+item}><img src={icons[item]}/></a>
                <a className = {styles.itemName} href={"https://tbc.wowhead.com/item="+item}>{names[item]}</a>
                <p>Buyout Price: {intToGold(listings[item].toFixed(4))}</p> 
              </div>)
            }
          }
        }
      }
    })
  }
  postsArr.sort((a,b) => (a.props.id).localeCompare(b.props.id)); //change sort to id, some items had same name for different ids, change key back to itemId
  // console.log(postsArr[0].key);




return (
    <div className={styles.container}>
      <Head>
        <title>Raider Auction House</title>
        <meta name="description" content="Generated by create next app" />
        <script src="https://wow.zamimg.com/widgets/power.js"></script>
        <link type="text/css" href="https://wow.zamimg.com/css/basic.css?16" rel="stylesheet"></link> 
      </Head>

      <main className={styles.main}>
      <div className= {styles.dropdown}>
        <button className ={styles.dropbtn}>Realm Select</button>
        <div className={styles.dropdownContent}>
            {realmsArr}
        </div>
      </div>
      <div className= {styles.dropdown}>
        <button className ={styles.dropbtn}>Auction House Select</button>
        <div className={styles.dropdownContent}>
            {ahArr}
        </div>
      </div>
      <div className={styles.main}>
        <h1>{realms[realm]}{auctionHouses[auctionHouse]}Auction House</h1>
        <div className={styles.dropdownContainer}>
          {filterArr}
        </div>
        <h1>Last Updated: {lastModified} </h1>
        {postsArr}
      </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}


export const getServerSideProps = async () => {
  let combinedData;
  try{
    const startTime = Date.now();
    const realmRes = await fetch('http://localhost:3000/api/realms');
    const realmData = await realmRes.json();

    let realmHash = {};
    realmData && realmData.map((realm) => {
      const {id, name} = realm
      realmHash[id] = name
      return;
    })
    const ahHash = {2:"Alliance",6:"Horde",7:"Neutral"};

    const realmKeys = Object.keys(realmHash);
    const ahKeys = Object.keys(ahHash);
    let data = {};
    data = realmKeys && await Promise.all(realmKeys.map(async (realmKey) => {
      let auctionHouseData = ahKeys && await Promise.all(ahKeys.map(async (ahKey) => {
        const auctionParams = new URLSearchParams({
          realmKey,
          ahKey,
        }).toString();
        const auctionRes =  auctionParams && await fetch(`http://localhost:3000/api/auctions?${auctionParams}`);
        const auctionData = await auctionRes.json();
        return auctionData 
      }))
      const realmData = {}
      realmData[realmKey] = auctionHouseData;
      return realmData
    }))

    let reformattedData = {} //reformatting data, removing arrays from promise
    data.forEach( (realmData) => {
      let realmAuctionData = {}
      let realmID;
      Object.keys(realmData).forEach((realmKey) => {
        realmAuctionData["2"] = realmData[realmKey][0];
        realmAuctionData["6"] = realmData[realmKey][1];
        realmAuctionData["7"] = realmData[realmKey][2];
        realmID = realmKey;
      });
      reformattedData[realmID] = realmAuctionData;
    })

    let allItems = {}; //hash that contains all the unique items found in the data.
    realmKeys.forEach( (realmKey) => {
      ahKeys.forEach( (ahKey) => {
        Object.keys(reformattedData[realmKey][ahKey].items).forEach((itemId) => {
            if(!allItems[itemId])
            {
              allItems[itemId] = itemId;
            }
          }
        )
      })
    })
    
    let newItems = false;
    let allItemInfoRes = await fetch('http://localhost:3000/api/allItemInfo'); //get all items from our database
    let allItemInfoData = await allItemInfoRes.json();
    const {names} = allItemInfoData;
    const allItemKeys = Object.keys(allItems)
    allItems && await Promise.all(allItemKeys.map( async (itemId) => { //go through all itemIds found in all the auction data and check if item is in our database
      if(!names[itemId]) //item not found in our database add item.
      {
        if(!newItems)
        {
          newItems = true;
        }
        const itemParams = new URLSearchParams({
          itemId
        }).toString();
        await fetch(`http://localhost:3000/api/addItem?${itemParams}`) //adds item to db
      }
    })
    )

    if(newItems)
    {
      allItemInfoRes = await fetch('http://localhost:3000/api/allItemInfo'); //recall updated data
      allItemInfoData = await allItemInfoRes.json();
    }

    const allRelevantItemRes = await fetch('http://localhost:3000/api/getRelevantItems');
    const allRelevantItemData = await allRelevantItemRes.json();
    // console.log("HERE", allRelevantItemData.itemClasses);
    const endTime = Date.now();
    combinedData = {
      realms: realmHash,
      auctionHouses: ahHash,
      data: reformattedData,
      allItemInfo: allItemInfoData,
      relevantItems : allRelevantItemData,
    }
    console.log(`Elapsed time ${endTime - startTime}`)
  }
  catch (error) {
    console.log('Error getting data', error);
  }

  return {
    props: {
      content: combinedData
    },
  }
}

export const intToGold = (int) =>
{
  const valueArr = int.toString().split(".");
  const gold = valueArr[0]
  const silver = valueArr[1].substr(0,2);
  const copper = valueArr[1]. substr(2)

  return gold + "g " + silver + "s " + copper +"c"
}

