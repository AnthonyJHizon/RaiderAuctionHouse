import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Auction from './auction';
import LoadSpinner from './loadSpinner';

export default function InfiniteScroll({ sortedKeys, auctions, initialData }) {
	const [itemsData, setItemsData] = useState(initialData);
	const [start, setStart] = useState(20);
	const [loading, setLoading] = useState(false);
	const { ref, inView } = useInView();

	let auctionsArr = [];
	useEffect(() => {
		let running = true;
		const loadMoreData = async () => {
			if (start < sortedKeys.length) {
				setLoading(true);
				const end = start + 20;
				let newItemData = {};
				await Promise.all(
					sortedKeys.slice(start, end).map(async (id) => {
						const idParams = new URLSearchParams({
							id,
						}).toString();
						const itemRes = await fetch(`/api/item/id?${idParams}`);
						const itemData = await itemRes.json();
						Object.assign(newItemData, itemData);
					})
				);
				if (running) {
					setItemsData(Object.assign(itemsData, newItemData));
					setStart(end);
					setLoading(false);
				}
			}
		};
		if (inView) {
			loadMoreData();
		}
		return () => ((running = false), setLoading(false));
	}, [inView, sortedKeys, itemsData, start, loading]);

	if (itemsData && auctions && sortedKeys) {
		let i = 0;
		sortedKeys.forEach((item) => {
			if (
				itemsData[item] &&
				itemsData[item].name !== 'Deprecated' &&
				auctions[item]
			) {
				if (
					i === Object.keys(itemsData).length - 1 &&
					start < Object.keys(auctions).length
				) {
					auctionsArr.push(
						<div key={item} ref={ref}>
							<Auction
								key={item}
								itemId={item}
								itemName={itemsData[item].name}
								itemIcon={itemsData[item].icon}
								itemVal={auctions[item]?.toFixed(4)}
							/>
						</div>
					);
				} else {
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
			}
			i++;
		});
	}

	return (
		<>
			{Object.keys(auctions).length > 0 ? (
				<>
					{auctionsArr}
					{loading && start < Object.keys(auctions).length && (
						<div className="flex items-center justify-center h-40">
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
