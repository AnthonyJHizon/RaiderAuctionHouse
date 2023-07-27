import cache from 'memory-cache';

import addItemInfo from '../../../utils/db/addItemInfo';
import getAccessToken from '../../../utils/db/getAccessToken';
import propsFormatAuctionData from '../../../utils/formatData/props/auction';
import fetchWithCacheAllItem from '../../../utils/cache/itemIds';
import updateCacheAllItem from '../../../utils/cache/updateItemIds';

export default async function handler(req, res) {
	try {
		const accessToken = await getAccessToken();
		const auctionRes = await fetch(
			//if a new item is discovered it is most likely going to be from this server's auction house
			`https://us.api.blizzard.com/data/wow/connected-realm/4728/auctions/7?namespace=dynamic-classic-us&access_token=${accessToken}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
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
