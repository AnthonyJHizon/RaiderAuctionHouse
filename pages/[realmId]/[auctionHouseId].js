import { useRouter } from 'next/router'
import getAccessToken from '../../utils/db/getAccessToken'
import getAllRelevantItemInfo from '../../utils/db/getAllRelevantItemInfo'
import pathsFormatRealmData from '../../utils/formatData/paths/realm'
import pathsFormatAuctionHousesData from '../../utils/formatData/paths/auctionHouse'
import propsFormatRealmData from '../../utils/formatData/props/realm'
import propsFormatAuctionData from '../../utils/formatData/props/auction'

export default function Auctions({data}) {
    const router = useRouter();
    const { realmId, auctionHouseId } = router.query;
    return <h2>{realmId}, {auctionHouseId}</h2> 
}


export async function getStaticPaths() {
  const accessToken = await getAccessToken();
  const realmRes = await fetch(`https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&access_token=${accessToken}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let realmData = await realmRes.json();
  realmData = await pathsFormatRealmData(realmData);

  const auctionRes = await fetch(`https://us.api.blizzard.com/data/wow/connected-realm/${realmData[0]}/auctions/index?namespace=dynamic-classic-us&locale=en_US&access_token=${accessToken}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    },
  })

  let auctionHouses = await auctionRes.json();
  auctionHouses = await pathsFormatAuctionHousesData(auctionHouses);

  let paths = [];

  realmData.forEach((realm) => {
    auctionHouses.forEach((auctionHouse) => {
      (
        paths.push({
          params: 
          {
            realmId: realm,
            auctionHouseId: auctionHouse,
          }
      }))
    })
  })
  return { paths, fallback: false }
}

export async function getStaticProps({params}) {
  let data = {}; 
  const accessToken = await getAccessToken();
  const realmRes = await fetch(`https://us.api.blizzard.com/data/wow/connected-realm/${params.realmId}?namespace=dynamic-classic-us&locale=en_US&access_token=${accessToken}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let realmData = await realmRes.json();
  realmData = await propsFormatRealmData(realmData);

  const auctionRes = await fetch(`https://us.api.blizzard.com/data/wow/connected-realm/${params.realmId}/auctions/${params.auctionHouseId}?namespace=dynamic-classic-us&access_token=${accessToken}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let auctionData = await auctionRes.json();
  auctionData = await propsFormatAuctionData(auctionData);

  data["realm"] = realmData.realm;
  data["lastModified"] = new Date(auctionRes.headers.get('last-modified')).toLocaleString('en-US', { timeZone: realmData.timeZone }).toString();
  data["auctionHouse"] = auctionData.auctionHouse;
  data["auctions"] = auctionData.items;
  return {
    props: {
      data,
    },
    revalidate: 60, //revalidate every minute.
  }
}
