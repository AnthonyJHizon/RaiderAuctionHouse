import { useRouter } from 'next/router'
import cache from "memory-cache"
import getAccessToken from '../../utils/db/getAccessToken'
import getAllRelevantItemInfo from '../../utils/db/getAllRelevantItemInfo'
import pathsFormatRealmData from '../../utils/formatData/paths/realm'
import pathsFormatAuctionHousesData from '../../utils/formatData/paths/auctionHouse'
import propsFormatRealmData from '../../utils/formatData/props/realm'
import propsFormatAuctionData from '../../utils/formatData/props/auction'
import cacheRealms from '../../utils/cache/realm'
import cacheAuctionHouses from '../../utils/cache/auctionHouse'

export default function Auctions({data}) {
    const router = useRouter();
    const { realmId, auctionHouseId } = router.query;
    return <h2>{realmId}, {auctionHouseId}</h2> 
}


async function fetchWithCache(key) {
  const value = cache.get(key);
  if (value) {
      console.log("Did not fetch");
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
          realmId: realm,
          auctionHouseId: auctionHouse,
        }
      })
    })
  })
  return { paths, fallback: false }
}

export async function getStaticProps({params}) {
  let data = {};
  let auctionHouses = await fetchWithCache("auctionHouses");
  let realms = await fetchWithCache("realms");
  return {
    props: {
      data,
    },
    revalidate: 60, //revalidate every minute.
  }
}
