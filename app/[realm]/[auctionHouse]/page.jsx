import cache from 'memory-cache';

import findItem from '../../../utils/db/findItem';
import propsFormatAuctionData from '../../../utils/formatData/props/auction';
import propsFormatRealmData from '../../../utils/formatData/props/realm';
import propsFormatAuctionHouseData from '../../../utils/formatData/props/auctionHouse';
import cacheRealms from '../../../utils/cache/realm';
import cacheAuctionHouses from '../../../utils/cache/auctionHouse';
import cacheRelevantItems from '../../../utils/cache/relevantItems';
import { getAuction } from '../../../utils/clients/blizzard/client';

import AuctionPage from './auctionPage';

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
			case 'relevantItems':
				return await cacheRelevantItems();
			default:
				break;
		}
	}
}

async function loadInitialData(auctions) {
	if (auctions) {
		const end = 20;
		let newItemData = {};
		await Promise.all(
			Object.keys(auctions)
				.slice(0, end)
				.map(async (id) => {
					let item = {};
					const itemData = await findItem(id);
					item[itemData._id] = {
						name: itemData.name,
						icon: itemData.iconURL,
					};
					Object.assign(newItemData, item);
				})
		);
		return newItemData;
	}
}

export async function generateStaticParams() {
	const realms = await fetchWithCache('realms');
	const auctionHouses = await fetchWithCache('auctionHouses');

	let paths = [];
	Object.keys(realms).forEach((realm) => {
		Object.keys(auctionHouses).forEach((auctionHouse) => {
			paths.push({
				realm: realm,
				auctionHouse: auctionHouse,
			});
		});
	});
	return paths;
}

export async function getData(realms, auctionHouses, realm, auctionHouse) {
	const response = await getAuction(realms[realm].id, auctionHouses[auctionHouse].id);
	let auctionData = await response.json();
	let data = {};
	auctionData = await propsFormatAuctionData(auctionData);
	data['self'] = {
		realm: realms[realm].name,
		auctionHouse: auctionHouses[auctionHouse].name,
		lastModified: new Date(response.headers.get('last-modified'))
			.toLocaleString('en-US', { timeZone: realms[realm].timeZone })
			.toString(), //get last modified header and convert to realm's timezone
	};
	data['auctions'] = auctionData;
	data['initialAuctions'] = await loadInitialData(auctionData);
	return data;
}

export async function generateMetadata({ params }) {
	return {
		title: (params.realm + '-' + params.auctionHouse).replace(
			/(^|-)[a-z]/g,
			(a) => {
				return (a[1] ? ' ' + a[1] : a[0]).toUpperCase();
			}
		),
	};
}

export default async function Page({ params }) {
	const { realm, auctionHouse } = params;
	const auctionHouses = await fetchWithCache('auctionHouses');
	const realms = await fetchWithCache('realms');
	const formattedRealms = await propsFormatRealmData(realms);
	const formattedAuctionHouses = await propsFormatAuctionHouseData(
		auctionHouses
	);
	const relevantItems = await fetchWithCache('relevantItems');
	const data = await getData(realms, auctionHouses, realm, auctionHouse);
	delete formattedRealms[realm]; //remove current realm from list of navigatable realms
	delete formattedAuctionHouses[auctionHouse]; //remove current auction house from list of navigatable auction houses
	return (
		<AuctionPage
			data={data}
			relevantItems={relevantItems}
			realms={formattedRealms}
			auctionHouses={formattedAuctionHouses}
		/>
	);
}
