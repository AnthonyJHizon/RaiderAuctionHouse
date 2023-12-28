import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePathname } from 'next/navigation';
import Auction from './auction';
import LoadSpinner from './loadSpinner';

export default function InfiniteScroll({ auctions, initialData }) {
	const [itemsData, setItemsData] = useState(initialData);
	const [start, setStart] = useState(20);
	const { ref, inView } = useInView();
	const pathname = usePathname().split('/');

	let auctionsArr = [];

	useEffect(() => {
		auctionsArr = [];
		setItemsData(initialData);
	}, [pathname]);

	useEffect(() => {
		if (inView) {
			loadMoreData();
		}
	}, [inView]);

	async function loadMoreData() {
		if (start < Object.keys(auctions).length) {
			const end = start + 20;
			let newItemData = {};
			await Promise.all(
				Object.keys(auctions)
					.slice(start, end)
					.map(async (id) => {
						const idParams = new URLSearchParams({
							id,
						}).toString();
						const itemRes = await fetch(`/api/item/id?${idParams}`);
						const itemData = await itemRes.json();
						Object.assign(newItemData, itemData);
					})
			);
			setItemsData(Object.assign(itemsData, newItemData));
			setStart(end);
		}
	}

	if (itemsData && auctions) {
		Object.keys(itemsData).forEach((item) => {
			if (itemsData[item].name !== 'Deprecated' && auctions[item]) {
				auctionsArr.push(
					<Auction
						key={item}
						itemId={item}
						itemName={itemsData[item].name}
						itemIcon={itemsData[item].icon}
						itemVal={auctions[item]?.toFixed(4)}
					/>
				);
			}
		});
	}

	return (
		<>
			{Object.keys(auctions).length > 0 ? (
				<>
					{auctionsArr}
					{start < Object.keys(auctions).length && (
						<div ref={ref} className="text-center mt-2 mb-0">
							<LoadSpinner />
						</div>
					)}
				</>
			) : (
				<div className="flex items-center justify-center text-center text-header-1">
					No Auctions Found
				</div>
			)}
		</>
	);
}
