'use server';

import { cacheGet } from '../lib/clients/redis/client';

export default async function AmountAuctions(realmKey, auctionHouseKey) {
	const data = await cacheGet(realmKey + '/' + auctionHouseKey);
	return data ?? 0;
}
