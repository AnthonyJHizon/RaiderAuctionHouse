import Head from 'next/head';
import Link from 'next/link';

import cache from 'memory-cache';

import getAccessToken from '../utils/db/getAccessToken';
import cacheAuctionHouses from '../utils/cache/auctionHouse';
import cacheRealms from '../utils/cache/realm';

import Banner from '../components/banner/banner';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function Home({ data }) {
	let realmsArr = [];
	Object.keys(data).forEach((realm) => {
		let auctionHouses = [];
		Object.keys(data[realm].auctionHouses).forEach((auctionHouse) => {
			auctionHouses.push(
				<Link
					key={realm + '-' + auctionHouse}
					href={`/${realm}/${auctionHouse}`}
				>
					<div className="relative h-[33.34%] opacity-[.99] transition-all duration-500 ease-in-out hover:scale-110">
						<div className="absolute flex items-center justify-center text-center h-full w-full text-normal-1 z-50">
							{data[realm].auctionHouses[auctionHouse].numAuctions}{' '}
							{data[realm].auctionHouses[auctionHouse].numAuctions != 1
								? 'Auctions'
								: 'Auction'}
						</div>
						<img
							src={`/auctionHouses/${auctionHouse}.webp`}
							alt=""
							className="z-[-10] h-full w-full object-cover"
						/>
					</div>
				</Link>
			);
		});
		realmsArr.push(
			<div
				key={realm}
				className="group relative flex flex-col w-[250px] h-[500px]"
			>
				<img
					src={`/cards/${realm}.webp`}
					alt=""
					className="h-full w-full absolute top-0 left-0 transition-all ease-in-out duration-1000 opacity-0 z-0 group-hover:opacity-100 group-hover:blur group-hover:z-30 object-cover"
				/>
				<div className="flex items-center justify-center text-center bg-black h-[10%] overflow-hidden text-normal-1 z-40">
					{data[realm].realm}
				</div>
				<div className="flex relative flex-col overflow-hidden h-[90%] w-full transition-all ease-in-out duration-1000 group-hover:opacity-0">
					<img
						src={`/cards/${realm}.webp`}
						alt=""
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="relative h-[35%] transition-all duration-700 ease-in-out cursor-pointer group-hover:z-30 group-hover:translate-y-[-75%]">
					{auctionHouses}
				</div>
			</div>
		);
	});
	realmsArr.sort((a, b) => a.key.localeCompare(b.key));
	return (
		<div className="flex flex-col items-center bg-icecrown bg-cover bg-no-repeat bg-center h-screen">
			<Head>
				<title>Raider Auction House</title>
				<meta
					name="description"
					content="Search through filtered WOTLK Classic auction house data."
				/>
			</Head>
			<Navbar />
			<main className="flex flex-wrap justify-center items-center gap-[2.5%] bg-white/70 backdrop-blur-md font-bold h-screen lg:w-6/12 w-9/12 overflow-y-scroll text-white pt-5 pl-2.5 pr-2.5 pb-12 text-normal-1 scrollbar-none">
				{/* <Banner /> */}
				{realmsArr}
			</main>
			<Footer />
		</div>
	);
}

export async function fetchWithCache(key) {
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

export async function getStaticProps() {
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
	return {
		props: {
			data,
			fallback: 'blocking',
		},
		revalidate: 60, //revalidate every minute.
	};
}
