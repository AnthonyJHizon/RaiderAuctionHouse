import { useRouter } from 'next/router'
import getAccessToken from '../../utils/getAccessToken'
import formatRealmData from '../../utils/formatRealmData'
import formatAuctionData from '../../utils/formatAuctionData'
import formatAuctionHousesData from '../../utils/formatAuctionHousesData'
import getAllRelevantItemInfo from '../../utils/getAllRelevantItemInfo'

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
  realmData = await formatRealmData(realmData);

  realmData.forEach(async(realm) => {
    const auctionRes = await fetch(`https://us.api.blizzard.com/data/wow/connected-realm/${realm.id}/auctions/index?namespace=dynamic-classic-us&locale=en_US&access_token=${accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let auctionHouses = await auctionRes.json();
    auctionHouses = await formatAuctionHousesData(auctionHouses);
    console.log(auctionHouses);

  })

  const paths = realmData.map((realmData) => ({
    params: { id: post.id },
  }))

  return { paths, fallback: false }
}