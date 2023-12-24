import cache, { get } from 'memory-cache';
import cacheFormatRealmData from '../formatData/cache/realm';
import { getSearchConnectedRealm } from '../clients/blizzard/client';

export default async function Realm() {
	const realmRes = await getSearchConnectedRealm();
	let realmData = await realmRes.json();
	realmData = await cacheFormatRealmData(realmData);
	cache.put('realms', realmData, 8.64e7 * 3);
	return realmData;
}
