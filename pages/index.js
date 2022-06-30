// import Head from 'next/head'

// export default function Home({ isConnected }) {
//   return (
//     <div className="container">
//       Hello
//     </div>
//   )
// }
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import getAccessToken from '../utils/getAccessToken'
import refreshToken from '../utils/refreshToken'
import formatRealmData from '../utils/formatRealmData'
import formatAuctionData from '../utils/formatAuctionData'
import addItemInfo from '../utils/addItemInfo';
import getAllItemInfo from '../utils/getAllItemInfo'
import getAllRelevantItemInfo from '../utils/getAllRelevantItemInfo'
import React, { useState, useEffect } from 'react'


export default function Home({content}) {
  const {realms, auctionHouses, data, relevantItemData} = content;
  const {relevantItems, relevantItemInfo} = relevantItemData;
  const {gems, consumables, tradeGoods, gemSubclasses, consumableSubclasses, tradeGoodSubclasses, itemClasses} = relevantItems;
  const [realm, setRealm] = useState(4728); //default realm set to benediction
  const [auctionHouse, setAH] = useState(2); //default ah set to alliance
  const [listings, setListings] = useState(data[realm][auctionHouse].items);
  const [itemClassFilter, setItemClassFilter] = useState(consumables);
  const [itemSubclassFilter, setItemSubclassFilter] = useState("Flask");
  const [lastModified, setLastMod] = useState(data[realm][auctionHouse].lastModified);
  const [filterIndicator, setFilterIndicator] = useState("Filter: Consumables, Flask");
  const [searchInput, setSearchInput] = useState();
  const [submitSearchInput, setSubmitSearchInput] = useState();
  const [searchItems, setSearchItems] = useState();

  useEffect(() => {
    async function setData(){
      if(submitSearchInput) {
        const item = submitSearchInput;
        const searchParams = new URLSearchParams({
          item
        }).toString();
        const searchItemRes = await fetch(`/api/item/search?${searchParams}`);
        const searchItemData = await searchItemRes.json();
        console.log(searchItemData);
        setSearchItems(searchItemData);
        setItemClassFilter();
        setItemSubclassFilter();
        setFilterIndicator("Search: \""+submitSearchInput+"\"");
      }
      setLastMod(data[realm][auctionHouse].lastModified);
      setListings(data[realm][auctionHouse].items);
  }
  setData();
  },[data, realm, auctionHouse, submitSearchInput]);

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

  filterArr.push(
    <div key = "All Items" className= {styles.dropdown}>
      <button className = {styles.filterDropBtn} onClick={() => {setItemClassFilter(), setItemSubclassFilter(), setFilterIndicator(), setSearchItems(), setSubmitSearchInput()}}>All Items</button>
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
    Object.keys(subclasses).forEach((subclass) => {
      subclassArr.push(
        <div key = {subclass} onClick={() => {setItemSubclassFilter(subclass), setItemClassFilter(itemClassFilter),  setFilterIndicator("Filter: "+itemClass+", "+subclass), setSearchItems(), setSubmitSearchInput()} }>{subclass}</div>
      )
    })
    subclassArr.sort((a,b) => a.key.localeCompare(b.key));
    filterArr.push (
      <div key = {itemClass} className= {styles.dropdown}>
        <button className = {styles.filterDropBtn} onClick={() => {setItemClassFilter(itemClassFilter), setItemSubclassFilter(), setFilterIndicator("Filter: "+itemClass), setSearchItems(), setSubmitSearchInput()}}>
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
    Object.keys(listings).forEach(async (item) => {
      if(item)
      {
        if(searchItems)
        {
          if(searchItems[item])
          {
            postsArr.push(
            <div key = {item} id = {searchItems[item].name} className= {styles.postsContainer}> 
              <a  style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer"><Image src={searchItems[item].icon} alt ="" height="56px" width="56px"/></a>
              <a className = {styles.itemName} style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer">{searchItems[item].name}</a>
              <p>Buyout Price: {intToGold(listings[item].toFixed(4))}</p> 
            </div>)
          }
        }
        else if(relevantItemInfo[item])
        {
          if(relevantItemInfo[item].name !== "Deprecated")
          {
            if(itemClassFilter && itemSubclassFilter)
            {
              if(itemClassFilter[item] === itemSubclassFilter)
              {
                postsArr.push(
                <div key = {item} id = {relevantItemInfo[item].name} className= {styles.postsContainer}> 
                  <a  style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer"><Image src={relevantItemInfo[item].icon} alt ="" height="56px" width="56px"/></a>
                  <a className = {styles.itemName} style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer">{relevantItemInfo[item].name}</a>
                  <p>Buyout Price: {intToGold(listings[item].toFixed(4))}</p> 
                </div>)
              }
            }
            else if(itemClassFilter)
            {
              if(itemClassFilter[item])
              {
                postsArr.push(
                <div key = {item} id = {relevantItemInfo[item].name} className= {styles.postsContainer}>
                  <a style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer"><Image src={relevantItemInfo[item].icon} alt ="" height="56px" width="56px"/></a>
                  <a className = {styles.itemName} style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer">{relevantItemInfo[item].name}</a>
                  <p>Buyout Price: {intToGold(listings[item].toFixed(4))}</p> 
                </div>)
              }
            }
            else
            {
              postsArr.push(
              <div key = {item} id = {relevantItemInfo[item].name} className= {styles.postsContainer}>
                <a style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer"><Image src={relevantItemInfo[item].icon} alt ="" height="56px" width="56px"/></a>
                <a className = {styles.itemName}style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer">{relevantItemInfo[item].name}</a>
                <p>Buyout Price: {intToGold(listings[item].toFixed(4))}</p> 
              </div>)
            }
          }
        }
      }
    })
  }

  postsArr.sort((a,b) => (a.props.id).localeCompare(b.props.id)); //change sort to id, some items had same name for different ids, change key back to itemId
  if(postsArr.length < 1) { //No items were pushed into the array, no items matched the filter
    postsArr.push(
      <div key = "None" className= {styles.postsContainer}>
        <p>No Items Found</p>
      </div>)
  }

  function handleSearchSubmit(e) {
    if (e.key === 'Enter' || e.button === 0) {
      if(searchInput)
      {
        setSubmitSearchInput(searchInput);
      }
    }
  }


return (
    <div className={styles.container}>
      <Head>
        <title>Raider Auction House</title>
        <meta name="description" content="Generated by create next app" />
        <script src="https://wow.zamimg.com/widgets/power.js" async></script>
        <link type="text/css" href="https://wow.zamimg.com/css/basic.css?16" rel="stylesheet"></link> 
      </Head>

      <main className={styles.main}>
        <div className={styles.main}>
          <div className={styles.dropdownContainer}>
          <div className= {styles.dropdown}>
            <button className ={styles.dropbtn}>Realm</button>
            <div className={styles.dropdownContent}>
                {realmsArr}
            </div>
          </div>
          <div className= {styles.dropdown}>
            <button className ={styles.dropbtn}>Auction House</button>
            <div className={styles.dropdownContent}>
                {ahArr}
            </div>
          </div>
          <input id = "searchInput" type="text" placeholder="Search" onChange={(e) => setSearchInput(e.target.value)} onKeyPress={(e) => handleSearchSubmit(e)}></input>
          <button onClick={(e) => handleSearchSubmit(e)}>Search</button>
        </div>
          <h1>{realms[realm]+" "+auctionHouses[auctionHouse]+" Auction House"}</h1>
          <div className={styles.dropdownContainer}>
            {filterArr}
          </div>
          <h1>Last Update: {lastModified} </h1>
          <h1>{filterIndicator}</h1>
          {postsArr}
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export const intToGold = (int) =>
{
  const valueArr = int.toString().split(".");
  const gold = valueArr[0]
  const silver = valueArr[1].substr(0,2);
  const copper = valueArr[1]. substr(2)

  return gold + "g " + silver + "s " + copper +"c"
}

export async function getStaticProps() {
  let combinedData;
  let errorRes;
  try{
    const startTime = Date.now();
    const accessToken = await refreshToken();
    const realmRes = await fetch(`https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&access_token=${accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let realmData = await realmRes.json();
    realmData = await formatRealmData(realmData);
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
    let timeout = 0;
    data = realmKeys && await Promise.all(realmKeys.map(async (realmKey) => {
      timeout += 100;
      await new Promise(resolve => setTimeout(resolve, timeout)); //add delay to prevent going over blizzard api call limit
      let auctionHouseData = ahKeys && await Promise.all(ahKeys.map(async (ahKey) => {
        const auctionRes = await fetch(`https://us.api.blizzard.com/data/wow/connected-realm/${realmKey}/auctions/${ahKey}?namespace=dynamic-classic-us&access_token=${accessToken}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        errorRes = auctionRes;
        const auctionData = await auctionRes.json();
        return formatAuctionData(auctionData, auctionRes.headers.get("date")); 
      }))
      const realmData = {}
      realmData[realmKey] = auctionHouseData;
      return realmData;
    }))

    let reformattedData = {} //reformatting data, removing arrays from promise
    data.forEach((realmData) => {
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

    const allRelevantItemData = await getAllRelevantItemInfo();
    combinedData = {
      realms: realmHash,
      auctionHouses: ahHash,
      data: reformattedData,
      relevantItemData: allRelevantItemData,
    }
    const endTime = Date.now();
    console.log(`Elapsed time ${endTime - startTime}`)
  }
  catch (error) {
    console.log(errorRes);
    console.log('Error getting data', error);
  }
  return {
    props: {
      content: combinedData,
    },
    revalidate: 60, //revalidate every minute.
  }
}