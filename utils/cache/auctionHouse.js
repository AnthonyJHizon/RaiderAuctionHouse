import cache from 'memory-cache';
import cacheFormatAuctionHousesData from '../formatData/cache/auctionHouse';
import { getAuctionHouse } from '../clients/blizzard/client';

export default async function AuctionHouse() {
	const auctionHouseRes = await getAuctionHouse('4728');

	let auctionHouseData = await auctionHouseRes.json();
	auctionHouseData = await cacheFormatAuctionHousesData(auctionHouseData);
	return cache.put('auctionHouses', auctionHouseData);
}
