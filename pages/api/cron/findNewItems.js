import cache from 'memory-cache';

import addItemInfo from '../../../utils/db/addItemInfo';
import getAccessToken from '../../../utils/db/getAccessToken';
import propsFormatAuctionData from '../../../utils/formatData/props/auction';
import fetchWithCacheAllItem from '../../../utils/cache/itemIds';
import updateCacheAllItem from '../../../utils/cache/updateItemIds';
import { getAuction } from '../../../utils/clients/blizzard/client';

export default async function handler(req, res) {
	try {
		const accessToken = await getAccessToken();
		//if a new item is discovered it is most likely going to be from this server's auction house
		const auctionRes = await getAuction('4728', '2');
		let auctionData = await auctionRes.json();
		auctionData = await propsFormatAuctionData(auctionData);
		let allItems = cache.get('allItems');
		if (!allItems) allItems = await fetchWithCacheAllItem();
		let newItems = [];
		Object.keys(auctionData).forEach((item) => {
			if (!allItems.has(item)) newItems.push(item);
		});
		await Promise.all(
			newItems.map(async (itemId, index) => {
				allItems.add(itemId);
				await new Promise((resolve) => setTimeout(resolve, index * 25)); //add delay to prevent going over blizzard api call limit
				await addItemInfo(itemId);
			})
		);
		if (newItems.length > 0) updateCacheAllItem();
		return res
			.status(200)
			.json({ mesage: 'Finished Search for New Items', success: true });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Server Error' });
	}
}
