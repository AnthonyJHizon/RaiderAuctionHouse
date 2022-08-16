import { useRouter } from 'next/router'
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
    const { realm, auctionHouse } = router.query;
    return <h2>{realm}, {auctionHouse}</h2> 
}


async function fetchWithCache(key) {
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
    name: realms[params.realm].name,
    auctionHouse: auctionHouses[params.auctionHouse].name,
    lastModified: new Date(auctionRes.headers.get("date")).toLocaleString('en-US', { timeZone: realms[params.realm].timeZone }).toString(),
  }
  data["auctions"] = auctionData;
  data["realms"] = await propsFormatRealmData(realms, params.realm);
  data["auctionHouses"] = await propsFormatAuctionHouseData(auctionHouses, params.auctionHouse);
  data["items"] = await getAllRelevantItemInfo();
  console.log(data);
  return {
    props: {
      data,
    },
    revalidate: 60, //revalidate every minute.
  }
}
