import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Home.module.css'
import cache from "memory-cache"
import getAccessToken from '../../utils/db/getAccessToken'
import getAllRelevantItemInfo from '../../utils/db/getAllRelevantItemInfo'
import propsFormatAuctionData from '../../utils/formatData/props/auction'
import propsFormatRealmData from '../../utils/formatData/props/realm'
import propsFormatAuctionHouseData from '../../utils/formatData/props/auctionHouse'
import cacheRealms from '../../utils/cache/realm'
import cacheAuctionHouses from '../../utils/cache/auctionHouse'

export default function Auctions({data}) {
  const router = useRouter();
  const { realm, auctionHouse, filter, subclass, search} = router.query;
  const { self, realms, auctionHouses, auctions, relevantItems } = data;
  const { relevantItemSubclasses, relevantItemInfo } = relevantItems;
  const { gems, consumables, tradeGoods, gemSubclasses, consumableSubclasses, tradeGoodSubclasses, itemClasses } = relevantItemSubclasses;
  
  const [searchInput, setSearchInput] = useState();
  const [submitSearchInput, setSubmitSearchInput] = useState();
  const [searchItems, setSearchItems] = useState();

  let filterIndicator = filter ? (subclass ?  "Filter: " + filter + ", " + subclass : filter) : search ? "Search: \""+search+"\"" : "";
  let itemClassFilter = consumables; //default view set to show consumable items

  useEffect(() => {
    async function setData() {
      if(search) {
        const item = search;
        const searchParams = new URLSearchParams({
          item
        }).toString();
        const searchItemRes = await fetch(`/api/item/search?${searchParams}`);
        const searchItemData = await searchItemRes.json();
        setSearchItems(searchItemData);
      }
      else {
        setSearchItems();
      }
  }
  setData();
  },[submitSearchInput, search]);

  let realmsArr = [];
  const realmKeys = Object.keys(realms);
  realmKeys.forEach((realmKey) => {
    let queryParams = {};
    if(filter) queryParams["filter"] = filter; if(subclass) queryParams["subclass"] = subclass; if(search) queryParams["search"] = search;
    realmsArr.push(
      <Link key={realmKey} href={{pathname: `../${realmKey}/${auctionHouse}`, query: queryParams }}>
        <div>{realms[realmKey]}</div>
      </Link>
    )
  })
  realmsArr.sort((a,b) => a.key.localeCompare(b.key)); //sort the array based on div key which is the name of the realm

  let auctionHouseArr = [];
  const auctionHouseKeys = Object.keys(auctionHouses);
  auctionHouseKeys.forEach((auctionHouseKey) => {
    let queryParams = {};
    if(filter) queryParams["filter"] = filter; if(subclass) queryParams["subclass"] = subclass; if(search) queryParams["search"] = search;
    auctionHouseArr.push(
      <Link key={auctionHouseKey} href={{pathname: `../${realm}/${auctionHouseKey}`, query: queryParams }}>
        <div>{auctionHouses[auctionHouseKey]}</div>
      </Link>
    )
  })

  function handleSearchSubmit(e) {
    if (e.key === 'Enter' || e.button === 0) {
      if(searchInput)
      {
        setSubmitSearchInput(searchInput);
        router.push(`../${realm}/${auctionHouse}?search=${searchInput}`);
      }
    }
  }

  let filterArr = [];

  itemClasses.forEach((itemClass) => {
    let subclassArr = [];
    let subclasses = {};
    switch (itemClass)
    {
      case "Gems":
        subclasses = gemSubclasses;
        if(filter && filter === "Gems") itemClassFilter = gems;
        break;
      case "Consumables":
        subclasses = consumableSubclasses;
        if(filter && filter === "Consumables") itemClassFilter = consumables;
        break;
      case "Trade Goods":
        subclasses = tradeGoodSubclasses;
        if(filter && filter === "Trade Goods") itemClassFilter = tradeGoods;
        break;
    }
    Object.keys(subclasses).forEach((subclass) => {
      subclassArr.push(
        <Link key={subclass} href={{ pathname: `../${realm}/${auctionHouse}`, query: { filter: itemClass, subclass: subclass} }}>
          <div key={subclass}>{subclass}</div>
        </Link>
      )
    })
    subclassArr.sort((a,b) => a.key.localeCompare(b.key));
    filterArr.push (
      <div key={itemClass} className={styles.dropDown}>
        <Link key={itemClass} href={{ pathname: `../${realm}/${auctionHouse}`, query: { filter: itemClass} }}>
          <button className={styles.dropDownBtn}>
            {itemClass}
          </button>
        </Link>
        <div className={styles.dropDownContent}>
            {subclassArr}
        </div>
      </div>
    )
  })

  let auctionsArr = [];
  if(auctions) {
    Object.keys(auctions).forEach(async (item) => {
      if(item)
      {
        if(searchItems)
        {
          if(searchItems[item])
          {
            if(searchItems[item].name !== "Deprecated")
            {
              auctionsArr.push(
              <div key={item} id={searchItems[item].name} className={styles.auctionContainer}> 
                <a  style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer"><Image src={searchItems[item].icon} alt ="" height="58px" width="58px"/></a>
                <a className={styles.itemName} style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer">{searchItems[item].name}</a>
                <p>{intToGold(auctions[item].toFixed(4))}</p> 
              </div>)
            }
          }
        }
        else if(relevantItemInfo[item])
        {
          if(relevantItemInfo[item].name !== "Deprecated")
          {
            if(itemClassFilter && subclass)
            {
              if(itemClassFilter[item] === subclass)
              {
                auctionsArr.push(
                <div key={item} id={relevantItemInfo[item].name} className={styles.auctionContainer}> 
                  <a style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer"><Image src={relevantItemInfo[item].icon} alt ="" height="58px" width="58px"/></a>
                  <a className={styles.itemName} style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer">{relevantItemInfo[item].name}</a>
                  <p>{intToGold(auctions[item].toFixed(4))}</p> 
                </div>)
              }
            }
            else if(itemClassFilter)
            {
              if(itemClassFilter[item])
              {
                auctionsArr.push(
                <div key={item} id={relevantItemInfo[item].name} className={styles.auctionContainer}>
                  <a style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer"><Image src={relevantItemInfo[item].icon} alt ="" height="58px" width="58px"/></a>
                  <a className={styles.itemName} style={{display: "table-cell"}} href={"https://tbc.wowhead.com/item="+item} target="_blank" rel="noreferrer">{relevantItemInfo[item].name}</a>
                  <p>{intToGold(auctions[item].toFixed(4))}</p> 
                </div>)
              }
            }
          }
        }
      }
    })
  }

  return (
    <div className={styles.container}>
    <Head>
      <title>Raider Auction House</title>
      <meta name="description" content="Search through filtered TBC Classic auction house data."/>
      <script src="https://wow.zamimg.com/widgets/power.js" async></script>
      <link type="text/css" href="https://wow.zamimg.com/css/basic.css?16" rel="stylesheet"></link> 
    </Head>

    <main className={styles.main}>
      <div className={styles.dropDownContainer}>
        <div className={styles.dropDown}>
          <button className={styles.dropDownBtn}>Realm</button>
          <div className={styles.dropDownContent}>
              {realmsArr}
          </div>
        </div>
        <div className={styles.dropDown}>
          <button className={styles.dropDownBtn}>Auction House</button>
          <div className={styles.dropDownContent}>
              {auctionHouseArr}
          </div>
        </div>
        <div className={styles.searchContainer}> 
            <input id = "searchInput" type="text" placeholder="Search" className={styles.searchBar} onChange={(e) => setSearchInput(e.target.value)} onKeyPress={(e) => handleSearchSubmit(e)}></input>
        </div>
      </div>
      <div className={styles.headerContainer}>
        <h1 className={styles.header1}>{self.realm + " " + self.auctionHouse}</h1>
      </div>
      <div className={styles.dropDownContainer}>
        {filterArr}
      </div>
      <div className={styles.headerContainer}>
        <h1 className={styles.header1}>Last Update: {self.lastModified}</h1>
      </div>
      <div className={styles.headerContainer}>
        <h2 className={styles.header2}>{filterIndicator}</h2>
      </div>          
      <div className={styles.auctionsContainer}>
        {auctionsArr}
      </div>
    </main>

    <footer className={styles.footer}>
        <p><a href="https://github.com/AnthonyJHizon">Anthony Joshua Hizon</a>, 2022</p>
    </footer>
  </div>
  )
}


export function intToGold(int) 
  {
    const valueArr = int.toString().split(".");
    const gold = valueArr[0]
    const silver = valueArr[1].substr(0,2);
    const copper = valueArr[1]. substr(2)
    return gold + "g " + silver + "s " + copper +"c"
  }

export async function fetchWithCache(key) {
  const value = cache.get(key);
  if (value) {
      return value;
  } else {
    switch(key) {
      case "realms":
        return await cacheRealms();
      case "auctionHouses":
        return await cacheAuctionHouses();
      default:
        break;
    }
  }
}

export async function getStaticPaths() {
  let realms = await fetchWithCache("realms");
  let auctionHouses = await fetchWithCache("auctionHouses");
  let paths = [];
  Object.keys(realms).forEach((realm) => {
    Object.keys(auctionHouses).forEach((auctionHouse) => {
      paths.push({
        params: 
        {
          realm: realm,
          auctionHouse: auctionHouse,
        }
      })
    })
  })
  return { paths, fallback: false }
}

export async function getStaticProps({params}) {
  const accessToken = await getAccessToken();
  let data = {};
  let auctionHouses = await fetchWithCache("auctionHouses");
  let realms = await fetchWithCache("realms");
  const auctionRes = await fetch(`https://us.api.blizzard.com/data/wow/connected-realm/${realms[params.realm].id}/auctions/${auctionHouses[params.auctionHouse].id}?namespace=dynamic-classic-us&access_token=${accessToken}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let auctionData = await auctionRes.json();
  auctionData = await propsFormatAuctionData(auctionData);
  data["self"] = { 
    realm: realms[params.realm].name,
    auctionHouse: auctionHouses[params.auctionHouse].name,
    lastModified: new Date(auctionRes.headers.get("last-modified")).toLocaleString('en-US', { timeZone: realms[params.realm].timeZone }).toString(),
  }
  data["auctions"] = auctionData;
  data["realms"] = await propsFormatRealmData(realms, params.realm);
  data["auctionHouses"] = await propsFormatAuctionHouseData(auctionHouses, params.auctionHouse);
  data["relevantItems"] = await getAllRelevantItemInfo();
  return {
    props: {
      data,
    },
    revalidate: 60, //revalidate every minute.
  }
}
