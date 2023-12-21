import { useState, useEffect, useRef } from 'react';

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
import loadInitialAuctions from '../../utils/db/loadInitialAuctions';

import Auction from '../../components/auction';
import Button from '../../components/dropdown/button';
import Dropdown from '../../components/dropdown/dropdown';
import Footer from '../../components/footer';
import InfiniteScroll from '../../components/infiniteScroll';
import Navbar from '../../components/navbar';
import LoadSpinner from '../../components/loadSpinner';

export default function Auctions({ data }) {
	const router = useRouter();
	const auctionsContainerRef = useRef(null);

	const { realm, auctionHouse, filter, subclass, search } = router.query;
	const {
		self,
		realms,
		auctionHouses,
		auctions,
		relevantItems,
		initialAuctions,
	} = data;
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
		: 'Filter: All';

	let itemClassFilter = gems; //default view set to show gems

	let queryParams = {};
	let filterArr = [];
	let auctionsArr = [];

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

	useEffect(() => {
		auctionsContainerRef.current.scroll({ top: 0, behavior: 'smooth' });
	}, [router]);

	function handleSearchSubmit(e) {
		if (e.key === 'Enter' || e.button === 0) {
			if (e.target.value && !loading) {
				router.push(`../${realm}/${auctionHouse}?search=${e.target.value}`);
			}
		}
	}

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

	if (auctions) {
		Object.keys(auctions).forEach((item) => {
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
				<title>{self.realm + ' ' + self.auctionHouse}</title>
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
			<main className="flex flex-col items-center text-black bg-white/75 backdrop-blur-md bg-white h-full w-[100vw] sm:w-[50vw] overflow-hidden">
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
					<div className="basis-full flex items-center justify-center w-[33.33%] text-normal-1">
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
				<div className="flex bg-royal-blue h-[5%] w-full">
					<div className="basis-full text-normal-1">
						<Button name={'All'} itemClass={'All'} />
					</div>
					{filterArr}
				</div>
				<div className="flex items-center h-[5%] justify-center text-center">
					<h1 className="text-header-1">Last Update: {self.lastModified}</h1>
				</div>
				<div className="flex items-center h-[5%] justify-center text-center">
					<h2 className="text-header-2">{filterIndicator}</h2>
				</div>
				<div
					ref={auctionsContainerRef}
					className="h-[72.5%] w-full overflow-y-scroll bg-white/50  scrollbar-none"
				>
					{Object.keys(queryParams).length !== 0 ? (
						loading ? (
							<div className="flex items-center justify-center text-center text-header-2">
								<LoadSpinner />
							</div>
						) : auctionsArr.length > 0 ? (
							auctionsArr
						) : (
							<div className="flex items-center justify-center text-center text-header-1">
								No Auctions Found
							</div>
						)
					) : (
						<InfiniteScroll auctions={auctions} initialData={initialAuctions} />
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
	data['initialAuctions'] = await loadInitialAuctions(auctionData);

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
