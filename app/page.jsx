import cache from 'memory-cache';

import getAccessToken from '../utils/db/getAccessToken';
import cacheAuctionHouses from '../utils/cache/auctionHouse';
import cacheRealms from '../utils/cache/realm';

import HomePage from './homePage';

export const revalidate = 60;

async function fetchWithCache(key) {
	const value = cache.get(key);
	if (value) {
		return value;
	} else {
		switch (key) {
			case 'realms':
				return await cacheRealms();
			case 'auctionHouses':
				return await cacheAuctionHouses();
			default:
				break;
		}
	}
}

async function getData() {
	let data = {};
	let auctionHouses = await fetchWithCache('auctionHouses');
	let realms = await fetchWithCache('realms');

	const accessToken = await getAccessToken();
	const realmKeys = Object.keys(realms);
	const auctionHouseKeys = Object.keys(auctionHouses);

	realmKeys &&
		(await Promise.all(
			realmKeys.map(async (realmKey) => {
				await new Promise((resolve) => setTimeout(resolve, 0));
				let auctionHouseData =
					auctionHouseKeys &&
					(await Promise.all(
						auctionHouseKeys.map(async (auctionHouseKey) => {
							const auctionRes = await fetch(
								`https://us.api.blizzard.com/data/wow/connected-realm/${realms[realmKey].id}/auctions/${auctionHouses[auctionHouseKey].id}?namespace=dynamic-classic-us&access_token=${accessToken}`,
								{
									method: 'GET',
									headers: {
										'Content-Type': 'application/json',
									},
								}
							);
							const auctionData = await auctionRes.json();
							let result = {};
							result['name'] = auctionHouses[auctionHouseKey].name;
							if (typeof auctionData.auctions === 'undefined') {
								result['numAuctions'] = 0;
							} else {
								result['numAuctions'] = auctionData.auctions.length;
							}
							return result;
						})
					));
				let auctionHousesData = {};
				auctionHouseData.forEach((auctionHouse) => {
					auctionHousesData[
						auctionHouse.name.toLowerCase().replace(/\s+/g, '-')
					] = auctionHouse;
				});
				data[realmKey] = {
					realm: realms[realmKey].name,
					auctionHouses: auctionHousesData,
				};
			})
		));
	return data;
}

export const metadata = {
	title: 'Raider Auction House',
	description: 'Search through filtered auction house data for WOTLK Classic',
};

export default async function Page() {
	const data = await getData();
	return <HomePage data={data} />;
}
