import { useRouter } from 'next/router'
import getAccessToken from '../../utils/db/getAccessToken'
import getAllRelevantItemInfo from '../../utils/db/getAllRelevantItemInfo'
import pathsFormatRealmData from '../../utils/formatData/paths/realm'
import pathsFormatAuctionHousesData from '../../utils/formatData/paths/auctionHouse'
import formatAuctionData from '../../utils/formatData/auction'

export default function Auctions() {
    const router = useRouter();
    const { realm, auctionHouse } = router.query;
    return <h2>{realm}, {auctionHouse}</h2> 
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
  console.log("END", paths);
  return { paths, fallback: false }
}

export async function getStaticProps({params}) { 
  console.log(params);
}
