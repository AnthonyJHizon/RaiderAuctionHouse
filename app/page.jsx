import Banner from '../components/banner/banner';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import RealmCard from '../components/realmCard';

import {
	cacheGet,
	cachedAunctionHouses,
	cachedRealms,
} from '../lib/clients/redis/client';
import WowToken from '../components/banner/wowToken';

export const revalidate = 60;

async function getData() {
	let data = {};
	let auctionHouses = await cachedAunctionHouses();
	let realms = await cachedRealms();

	const realmKeys = Object.keys(realms);
	const auctionHouseKeys = Object.keys(auctionHouses);

	realmKeys &&
		(await Promise.all(
			realmKeys.map(async (realmKey) => {
				let auctionHouseData =
					auctionHouseKeys &&
					(await Promise.all(
						auctionHouseKeys.map(async (auctionHouseKey) => {
							let result = {};
							result['name'] = auctionHouses[auctionHouseKey].name;
							result['numAuctions'] =
								(await cacheGet(realmKey + '/' + auctionHouseKey)) ?? 0;
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
			<main className="flex flex-wrap justify-center items-center xl:w-6/12 w-9/12 text-white font-bold text-normal-1 h-screen overflow-y-scroll scrollbar-none bg-white/70 backdrop-blur-md">
				<Banner />
				{/* <WowToken /> */}
				<div className="flex flex-wrap justify-center items-center gap-x-[2.5%] gap-y-8 w-full pt-10 pl-2.5 pr-2.5 pb-12">
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
				</div>
			</main>
			<Footer />
		</div>
	);
}
