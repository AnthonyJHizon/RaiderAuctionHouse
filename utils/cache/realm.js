import cache from 'memory-cache';
import getAccessToken from '../../utils/db/getAccessToken';
import cacheFormatRealmData from '../formatData/cache/realm';

module.exports = async function Realm() {
	const accessToken = await getAccessToken();
	const realmRes = await fetch(
		`https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us&access_token=${accessToken}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
	let realmData = await realmRes.json();
	realmData = await cacheFormatRealmData(realmData);
	cache.put('realms', realmData, 8.64e7 * 3);
	return realmData;
};
