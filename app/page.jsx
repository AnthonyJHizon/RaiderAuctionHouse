import cache from 'memory-cache';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import RealmCard from '../components/realmCard';

import cacheAuctionHouses from '../utils/cache/auctionHouse';
import cacheRealms from '../utils/cache/realm';

import redis from '../utils/redis/client';

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
							let result = {};
							result['name'] = auctionHouses[auctionHouseKey].name;
							result['numAuctions'] =
								(await redis.get(realmKey + '/' + auctionHouseKey)) || 0;
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
					name: realms[realmKey].name,
					auctionHouses: auctionHousesData,
				};
			})
		));
	return data;
}

export default async function Page() {
	const data = await getData();
	return (
		<div className="flex flex-col items-center bg-icecrown bg-cover bg-no-repeat bg-center h-screen">
			<Navbar />
			<main className="flex flex-wrap justify-center items-center gap-[2.5%] bg-white/70 backdrop-blur-md font-bold h-screen lg:w-6/12 w-9/12 overflow-y-scroll text-white pt-5 pl-2.5 pr-2.5 pb-12 text-normal-1 scrollbar-none">
				{Object.keys(data)
					.sort()
					.map((realm) => {
						return (
							<RealmCard
								key={realm}
								realm={realm}
								name={data[realm].name}
								auctionHouses={data[realm].auctionHouses}
							/>
						);
					})}
			</main>
			<Footer />
		</div>
	);
}
