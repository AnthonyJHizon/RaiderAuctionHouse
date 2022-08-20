import Head from 'next/head'
import styles from '../styles/Home.module.css'
import getAccessToken from '../utils/db/getAccessToken'
import cache from "memory-cache"
import cacheRealms from '../utils/cache/realm'
import cacheAuctionHouses from '../utils/cache/auctionHouse'
import propsFormatRealmData from '../utils/formatData/props/realm'
import propsFormatAuctionHouseData from '../utils/formatData/props/auctionHouse'

export default function Home({}) {
return (
    <div className={styles.container}>
      <Head>
        <title>Raider Auction House</title>
        <meta name="description" content="Search through filtered TBC Classic auction house data."/>
      </Head>

      <main className={styles.main}>

      </main>

      <footer className={styles.footer}>
          <p><a href="https://github.com/AnthonyJHizon">Anthony Joshua Hizon</a>, 2022</p>
      </footer>
    </div>
  )
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


export async function getStaticProps() {
  let data = {};
  let auctionHouses = await fetchWithCache("auctionHouses");
  let realms = await fetchWithCache("realms");

  const accessToken = await getAccessToken();
  const realmKeys = Object.keys(realms);
  const auctionHouseKeys = Object.keys(auctionHouses);

  let timeout = 0;
  realmKeys && await Promise.all(realmKeys.map(async(realmKey) => {
    timeout += 100;
    await new Promise(resolve => setTimeout(resolve, timeout)); //add delay to prevent going over blizzard api call limit
    let auctionHouseData = auctionHouseKeys && await Promise.all(auctionHouseKeys.map(async (auctionHouseKey) => {
      const auctionRes = await fetch(`https://us.api.blizzard.com/data/wow/connected-realm/${realms[realmKey].id}/auctions/${auctionHouses[auctionHouseKey].id}?namespace=dynamic-classic-us&access_token=${accessToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const auctionData = await auctionRes.json(); auctionData.auctions.length;
      let result = {}
      result["name"] = auctionHouses[auctionHouseKey].name;
      result["numAuctions"] = auctionData.auctions.length;
      return result;
    }))
    let auctionHousesData = {}
    auctionHouseData.forEach((auctionHouse) => {
      auctionHousesData[auctionHouse.name.toLowerCase().replace(/\s+/g, '-')] = auctionHouse;
    })
    data[realmKey] = {
      realm: realms[realmKey].name,
      auctionHouses: auctionHousesData,
    }
  }))

  console.log(data.benediction.auctionHouses);

  return {
    props: {
      data,
    },
    revalidate: 60, //revalidate every minute.
  }
}