import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import Script from 'next/script';
import Head from 'next/head';

import cache from 'memory-cache';

import getAccessToken from '../../utils/db/getAccessToken';
import propsFormatAuctionData from '../../utils/formatData/props/auction';
import propsFormatRealmData from '../../utils/formatData/props/realm';
import propsFormatAuctionHouseData from '../../utils/formatData/props/auctionHouse';
import cacheRealms from '../../utils/cache/realm';
import cacheAuctionHouses from '../../utils/cache/auctionHouse';
import cacheRelevantItems from '../../utils/cache/relevantItems';

import Auction from '../../components/auction';
import Dropdown from '../../components/dropdown/dropdown';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

export default function Auctions({ data }) {
	const router = useRouter();

	const { realm, auctionHouse, filter, subclass, search } = router.query;
	const { self, realms, auctionHouses, auctions, relevantItems } = data;
	const { relevantItemSubclasses, relevantItemInfo } = relevantItems;
	const {
		gems,
		consumables,
		tradeGoods,
		glyphs,
		gemSubclasses,
		consumableSubclasses,
		tradeGoodSubclasses,
		glyphSubclasses,
		itemClasses,
	} = relevantItemSubclasses;

	const [searchItems, setSearchItems] = useState();
	const [loading, setLoading] = useState(false);

	let filterIndicator = filter
		? subclass
			? 'Filter: ' + filter + ', ' + subclass
			: 'Filter: ' + filter
		: search
		? 'Search: "' + search + '"'
		: '';

	let itemClassFilter = gems; //default view set to show gems

	let queryParams = {};
	if (filter) queryParams['filter'] = filter;
	if (subclass) queryParams['subclass'] = subclass;
	if (search) queryParams['search'] = search;

	useEffect(() => {
		async function setData() {
			if (search) {
				setLoading(true);
				const item = search;
				const searchParams = new URLSearchParams({
					item,
				}).toString();
				const searchItemRes = await fetch(`/api/item/search?${searchParams}`);
				const searchItemData = await searchItemRes.json();
				setSearchItems(searchItemData);
				setLoading(false);
			} else {
				setSearchItems();
			}
		}
		setData();
	}, [search]);

	function handleSearchSubmit(e) {
		if (e.key === 'Enter' || e.button === 0) {
			if (e.target.value && !loading) {
				router.push(`../${realm}/${auctionHouse}?search=${e.target.value}`);
			}
		}
	}

	let filterArr = [];

	itemClasses.forEach((itemClass) => {
		let subclasses = {};
		switch (itemClass) {
			case 'Gems':
				subclasses = gemSubclasses;
				if (filter && filter === 'Gems') itemClassFilter = gems;
				break;
			case 'Consumables':
				subclasses = consumableSubclasses;
				if (filter && filter === 'Consumables') itemClassFilter = consumables;
				break;
			case 'Trade Goods':
				subclasses = tradeGoodSubclasses;
				if (filter && filter === 'Trade Goods') itemClassFilter = tradeGoods;
				break;
			case 'Glyphs':
				subclasses = glyphSubclasses;
				if (filter && filter === 'Glyphs') itemClassFilter = glyphs;
				break;
		}
		filterArr.push(
			<Dropdown
				key={itemClass}
				name={itemClass}
				itemClass={itemClass}
				content={Object.keys(subclasses).sort()}
				type="Filter"
			/>
		);
	});

	let auctionsArr = [];

	if (auctions) {
		Object.keys(auctions).forEach(async (item) => {
			if (item) {
				if (searchItems) {
					if (searchItems[item]) {
						if (searchItems[item].name !== 'Deprecated') {
							auctionsArr.push(
								<Auction
									key={item}
									itemId={item}
									itemName={searchItems[item].name}
									itemIcon={searchItems[item].icon}
									itemVal={auctions[item].toFixed(4)}
								/>
							);
						}
					}
				} else if (relevantItemInfo[item]) {
					if (relevantItemInfo[item].name !== 'Deprecated') {
						if (itemClassFilter && subclass) {
							if (itemClassFilter[item] === subclass) {
								auctionsArr.push(
									<Auction
										key={item}
										itemId={item}
										itemName={relevantItemInfo[item].name}
										itemIcon={relevantItemInfo[item].icon}
										itemVal={auctions[item].toFixed(4)}
									/>
								);
							}
						} else if (itemClassFilter) {
							if (itemClassFilter[item]) {
								auctionsArr.push(
									<Auction
										key={item}
										itemId={item}
										itemName={relevantItemInfo[item].name}
										itemIcon={relevantItemInfo[item].icon}
										itemVal={auctions[item].toFixed(4)}
									/>
								);
							}
						}
					}
				}
			}
		});
	}

	return (
		<div className="flex flex-col items-center bg-icecrown bg-no-repeat bg-cover bg-center h-[100vh]">
			<Head>
				<title>
					{self.realm} {self.auctionHouse}
				</title>
				<meta
					name="description"
					content="Search through filtered WOTLK Classic auction house data."
				/>
			</Head>
			<Script
				src="https://wow.zamimg.com/widgets/power.js"
				strategy="lazyOnload"
			/>
			<Navbar />
			<main className="flex flex-col items-center text-black bg-white h-[95%] w-[50vw]">
				<div className="inline-flex bg-royal-blue h-[5%] w-full">
					<Dropdown
						name={'Realm'}
						queryParams={queryParams}
						content={Object.keys(realms).sort()}
						realms={realms}
						type="Realm"
					/>
					<Dropdown
						name={'Auction House'}
						queryParams={queryParams}
						content={Object.keys(auctionHouses)}
						auctionHouses={auctionHouses}
						type="AuctionHouse"
					/>
					<div className="relative flex items-center justify-center w-[33.33%]">
						<input
							id="searchInput"
							type="text"
							placeholder="Search"
							className="h-[50%] w-[80%]"
							onKeyPress={(e) => handleSearchSubmit(e)}
						></input>
					</div>
				</div>
				<div className="flex items-center h-[5%] justify-center text-center">
					<h1 className="text-header-1">
						{self.realm + ' ' + self.auctionHouse}
					</h1>
				</div>
				<div className="inline-flex bg-royal-blue h-[5%] w-full">
					{filterArr}
				</div>
				<div className="flex items-center h-[5%] justify-center text-center">
					<h1 className="text-header-1">Last Update: {self.lastModified}</h1>
				</div>
				<div className="flex items-center h-[5%] justify-center text-center">
					<h2 className="text-header-2">{filterIndicator}</h2>
				</div>
				<div className="h-[72.9%] w-full overflow-y-scroll bg-neutral-50  scrollbar-thin scrollbar-thumb-cyan scrollbar-track-inherit">
					{loading ? (
						<div className="flex items-center justify-center text-center text-header-2">
							<p className="animate-pulse">Loading...</p>
						</div>
					) : (
						auctionsArr
					)}
				</div>
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
			case 'relevantItems':
				return await cacheRelevantItems();
			default:
				break;
		}
	}
}

export async function getStaticPaths() {
	let realms = await fetchWithCache('realms');
	let auctionHouses = await fetchWithCache('auctionHouses');

	let paths = [];
	Object.keys(realms).forEach((realm) => {
		Object.keys(auctionHouses).forEach((auctionHouse) => {
			paths.push({
				params: {
					realm: realm,
					auctionHouse: auctionHouse,
				},
			});
		});
	});
	return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
	let data = {};

	const auctionHouses = await fetchWithCache('auctionHouses');
	const realms = await fetchWithCache('realms');
	const accessToken = await getAccessToken();
	const auctionRes = await fetch(
		`https://us.api.blizzard.com/data/wow/connected-realm/${
			realms[params.realm].id
		}/auctions/${
			auctionHouses[params.auctionHouse].id
		}?namespace=dynamic-classic-us&access_token=${accessToken}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	let auctionData = await auctionRes.json();

	auctionData = await propsFormatAuctionData(auctionData);

	data['self'] = {
		realm: realms[params.realm].name,
		auctionHouse: auctionHouses[params.auctionHouse].name,
		lastModified: new Date(auctionRes.headers.get('last-modified'))
			.toLocaleString('en-US', { timeZone: realms[params.realm].timeZone })
			.toString(), //get last modified header and convert to realm's timezone
	};

	data['auctions'] = auctionData;
	data['realms'] = await propsFormatRealmData(realms);
	data['auctionHouses'] = await propsFormatAuctionHouseData(auctionHouses);
	data['relevantItems'] = await fetchWithCache('relevantItems');

	delete data['realms'][params.realm]; //remove current realm from list of navigatable realms
	delete data['auctionHouses'][params.auctionHouse]; //remove current auction house from list of navigatable auction houses
	return {
		props: {
			data,
			fallback: 'blocking',
		},
		revalidate: 60, //revalidate every minute.
	};
}
