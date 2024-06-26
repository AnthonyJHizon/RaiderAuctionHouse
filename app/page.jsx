import Banner from '../components/banner/index';
import RealmCard from '../components/realmCard';

import {
	cachedAunctionHouses,
	cachedRealms,
} from '../lib/clients/redis/client';
import WowToken from '../components/wowToken';

export const revalidate = 60;

async function getData() {
	let data = {};
	let auctionHouses = await cachedAunctionHouses();
	let realms = await cachedRealms();

	const realmKeys = Object.keys(realms);
	const auctionHouseKeys = Object.keys(auctionHouses);

	realmKeys &&
		realmKeys.map((realmKey) => {
			let auctionHouseData =
				auctionHouseKeys &&
				auctionHouseKeys.map((auctionHouseKey) => {
					let result = {};
					result['name'] = auctionHouses[auctionHouseKey].name;
					return result;
				});
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
		});
	return data;
}

export default async function Page() {
	const data = await getData();
	return (
		<div className="relative flex flex-col items-center bg-cataclysm bg-cover bg-no-repeat bg-center h-screen w-screen overflow-y-scroll scrollbar-none">
			<main className="relative flex flex-wrap justify-center items-center divide-y h-screen w-full text-white font-bold text-normal-1">
				<Banner />
				<WowToken />
				<div className="w-full flex justify-center items-center">
					<div className="relative flex flex-wrap justify-center items-center w-full xl:w-6/12 md:w-9/12 h-fit gap-x-[2.5%] gap-y-8 pt-10 pl-2.5 pr-2.5 pb-12 bg-white/20 backdrop-blur-md">
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
				</div>
			</main>
		</div>
	);
}
