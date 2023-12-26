import cache from 'memory-cache';

import addItemInfo from '../../../utils/db/addItemInfo';
import propsFormatAuctionData from '../../../utils/formatData/props/auction';
import { getAuction } from '../../../utils/clients/blizzard/client';
import {
	cacheUpdateAllItemIds,
	cachedItemIds,
} from '../../../utils/redis/client';

export default async function handler(req, res) {
	try {
		//if a new item is discovered it is most likely going to be from this server's auction house
		const auctionRes = await getAuction('4728', '2');
		let auctionData = await auctionRes.json();
		auctionData = await propsFormatAuctionData(auctionData);

		let allItems = await cachedItemIds();
		let newItems = [];

		Object.keys(auctionData).forEach((item) => {
			if (!allItems.has(item)) newItems.push(item);
		});

		newItems.length > 0 &&
			(await Promise.all(
				newItems.forEach(async (itemId, index) => {
					//add delay to prevent going over blizzard api call limit
					await new Promise((resolve) => setTimeout(resolve, index * 25)).then(
						async () => {
							await addItemInfo(itemId);
							allItems.add(itemId);
						}
					);
				})
			));

		cacheUpdateAllItemIds(allItems);

		return res
			.status(200)
			.json({ mesage: 'Finished Search for New Items', success: true });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Server Error' });
	}
}
