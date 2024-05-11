'use server';

import { cacheGet } from '../lib/clients/redis/client';

export default async function getNumAuctions(realmKey, auctionHouseKey) {
	// const numAuctions = (await cacheGet(realmKey + '/' + auctionHouseKey));
	// console.log(numAuctions);
	return await cacheGet(`${realmKey}/${auctionHouseKey}`);
}
