import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Home({listings, lastModified, realms}) {
  const [currRealm, setRealm] = useState(4728);
  const [currAH, setCurrAH] = useState(7);
  let map = new Map();
  let postsArr = [];
  let realmsArr = [];
  let ahArr = [];
  let realmMap = new Map();
  let ahMap = new Map();
  ahMap.set(2, "Alliance");
  ahMap.set(6, "Horde");
  ahMap.set(7, "Neutral")
  for (const [key,value] of ahMap.entries()) {
    ahArr.push(
      <div key = {key} onClick={() => setCurrAH(key)}>{value}</div>
    )
  }
  for(let i = 0; i<realms.results.length-1;i++)
  {
    realmMap.set(realms.results[i].data.realms[0].id, realms.results[i].data.realms[0].name.en_US, );
  }
  const mapSort = new Map([...realmMap.entries()].sort((a, b) => a[1].localeCompare(b[1])));
  for (const [key,value] of mapSort.entries()) {
    realmsArr.push(
      <div key = {key} onClick={() => setRealm(key) }>{value}</div>
    )
  }
  for(let i = 0; i<listings.auctions.length-1;i++)
  {
    if(!map.has(listings.auctions[i].item.id) && listings.auctions[i].buyout > 0) // buyouts are sometimes = 0
    {
      map.set(listings.auctions[i].item.id, listings.auctions[i].buyout/listings.auctions[i].quantity/10000);
    }
    else
    {
      if(map.get(listings.auctions[i].item.id) > listings.auctions[i].buyout/listings.auctions[i].quantity/10000 && listings.auctions[i].buyout > 0) // buyouts are sometimes = 0
      {
        map.set(listings.auctions[i].item.id, listings.auctions[i].buyout/listings.auctions[i].quantity/10000);
      }
    }
  }
  for (const [key,value] of map.entries()) {
    let itemName = "loading....";
    let itemIconURL = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
    const { data : name, error : nameError } = useSWR('https://us.api.blizzard.com/data/wow/item/'+key+'?namespace=static-classic-us&locale=en_US&access_token=USwMmO5QuXAeExdcWCOFcaUn1SorqzoyRJ', fetcher)
    const { data : icon, error : iconError } = useSWR('https://us.api.blizzard.com/data/wow/media/item/'+key+'?namespace=static-classic-us&locale=en_US&access_token=USwMmO5QuXAeExdcWCOFcaUn1SorqzoyRJ', fetcher)
    if(name != undefined)
    {
      itemName = name.name;
    }
    if(icon != undefined)
    {
      itemIconURL = icon.assets[0].value;
    }
    postsArr.push(
      <div key = {key} className= {styles.postsContainer}>
        <a href={"https://tbc.wowhead.com/item="+key}><img src={itemIconURL}/></a>
        <a className = {styles.itemName} href={"https://tbc.wowhead.com/item="+key}>{itemName}</a>
        <p>Buyout Price: {intToGold(value.toFixed(4))}</p>
      </div>
    )
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Raider Auction House</title>
        <meta name="description" content="Generated by create next app" />
        <script></script>
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
        <div className={styles.main} >
          <h1>{realmMap.get(currRealm)}{ahMap.get(currAH)}Auction House</h1>
          <h1>Last Updated: {lastModified} </h1>
            {postsArr}
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}


export const getStaticProps = async () => {
  let data;
  let lastMod;
  let realmData;
  try{
    const res = await fetch("https://us.api.blizzard.com/data/wow/connected-realm/4372/auctions/7?namespace=dynamic-classic-us&locale=en_US&access_token=USwMmO5QuXAeExdcWCOFcaUn1SorqzoyRJ");
    data = await res.json();
    lastMod = res.headers.get('last-modified');
    const realmRes = await fetch('https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&orderby=&access_token=USwMmO5QuXAeExdcWCOFcaUn1SorqzoyRJ');
    realmData = await realmRes.json();
  }
  catch (error) {
    console.log('Error getting data', error);
  }
  return {
    props: {
      listings : data,
      lastModified : lastMod,
      realms : realmData,
    },
    revalidate: 5,
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
