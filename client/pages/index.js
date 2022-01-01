import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react'


export default function Home({content}) {
  const {realms, auctionHouses, data} = content;
  // console.log(realms)
  // console.log(auctionHouse)
  console.log(data)

  let realmsArr = [];
  const realmKeys = Object.keys(realms);
  realmKeys.forEach((realmKey) => {
    realmsArr.push(
      <div key = {realmKey} onClick={() => setRealm(key) }>{realms[realmKey]}</div>
    )
  })

  let ahArr = [];
  const ahKeys = Object.keys(auctionHouses);
  ahKeys.forEach((ahKey) => {
    ahArr.push(
      <div key = {ahKey} onClick={() => setRealm(key) }>{auctionHouses[ahKey]}</div>
    )
  })

  // console.log(data);
  // console.log(data.length);

    // data.map(realm => {
    //   console.log(realm);
    // })
//   const [realm, setRealm] = useState(4728); //default realm set to benediction
//   const [auctionHouse, setAH] = useState(7); //default ah set to neutral
//   const [listings, setListings] = useState();
//   const [lastModified, setLastMod] = useState();
//   // const [totalItems, setTotalItems] = useState();
//   // const [uniqueCount, setUniqueCount] = useState();
//   // const [isLoading, setIsLoading] = useState();

//   useEffect(() => {
//     async function setData(){
//       setLastMod(data.data.realm.auctionHouse.lastModified);
//       setListings(data.data.realm.auctionHouse.items);
//       setTotalItems(data.total);
//       setUniqueCount(data.uniqueItems);
//       // console.log(data.items);
//   }

//   setData();
//   },[realm, auctionHouse]);


//   // fetchData();
//   // },[realmKey, ahKey]);


//   // let postsArr = [];
// let realmsArr = [];
// let ahArr = [];
// const auctionHouseMap = 
// for (const [key,value] of data.data.auctionHouse.entries()) {
//   ahArr.push(
//     <div key = {key} onClick={() => setAH(key)}>{value}</div>
//   )
// }
// for (const [key,value] of data.data.realms.entries()) {
//   realmsArr.push(
//     <div key = {key} onClick={() => setRealm(key) }>{value}</div>
//   )
// }

// if(listings){
//   listings.map( (item) => {
//     if(item.itemInfo.levelReq != -1)
//     {
//     // console.log(item.itemInfo);
//     postsArr.push(
//       <div key = {item.id} className= {styles.postsContainer}>
//       <a href={"https://tbc.wowhead.com/item="+item.id}><img src={item.itemInfo.iconURL}/></a>
//       <a className = {styles.itemName} href={"https://tbc.wowhead.com/item="+item.id}>{item.itemInfo.name}</a>
//       <p>Buyout Price: {intToGold(item.buyout.toFixed(4))}</p>
//     </div>)
//     }
//     else //item is "Deprecated", item is listed, but can not get its info from blizzard api, info attributes are defaulted to "Deprecated" for strings and -1 for Numbers
//     {
//       postsArr.push(
//         <div key = {item.id} className= {styles.postsContainer}>
//         <a href={"https://tbc.wowhead.com/item="+item.id}><img src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg"/></a>
//         <a className = {styles.itemName} href={"https://tbc.wowhead.com/item="+item.id}>{item.itemInfo.name}</a>
//         <p>Buyout Price: {intToGold(item.buyout.toFixed(4))}</p> 
//       </div>)
//     }
//   })
// }

// if (isLoading)
// {
//   postsArr = [];
//   // setTotalItems("Loading...");
//   // setUniqueCount("Loading...");
//   // setLastMod("Loading...");
//   postsArr.push(
//     <div key = "">Loading</div>
//   )
// }
// else if (!listings) // nothing in auction house for selected realm and ah type
// {
//   postsArr.push(
//     <div key = "">Dead Server Kek</div>
//   )
// }


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
      <div className={styles.main} >
        {/* <h1>{realm}{auctionHouse}Auction House</h1>
        <h1>Last Updated: {lastModified} </h1>
        <h2>Total Auctions: {totalItems} Unique Items: {uniqueCount}</h2>
        {postsArr} */}
      </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}


export const getStaticProps = async () => {
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
    data = realmKeys && await Promise.all(realmKeys.map(async (realmKey, index) => {
      const sleepMultiplier = index
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

    const endTime = Date.now();
    combinedData = {
      realms: realmHash,
      auctionHouses: ahHash,
      data: reformattedData
    }
    console.log(`Elapsed time ${endTime - startTime}`)
  }
  catch (error) {
    console.log('Error getting data', error);
  }

  // [{'benediction':{'2':{}, '6': {}, '7':{}}}.]
  return {
    props: {
      content: combinedData
    },
    revalidate: 60
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

