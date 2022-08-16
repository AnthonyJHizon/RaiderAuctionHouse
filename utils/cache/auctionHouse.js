import cache from "memory-cache"
import getAccessToken from '../../utils/db/getAccessToken'
import cacheFormatAuctionHousesData from '../formatData/cache/auctionHouse'

module.exports = async function AuctionHouse() {
  console.log("fetching");
  const accessToken = await getAccessToken();
  const auctionHouseRes = await fetch(`https://us.api.blizzard.com/data/wow/connected-realm/4728/auctions/index?namespace=dynamic-classic-us&locale=en_US&access_token=${accessToken}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    },
  })

  let auctionHouseData = await auctionHouseRes.json();
  auctionHouseData = await cacheFormatAuctionHousesData(auctionHouseData);
  return cache.put("auctionHouses", auctionHouseData);
}