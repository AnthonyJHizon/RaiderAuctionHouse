export default function Auction(data) {
	let minPriceHash = {};
	data.auctions &&
		data.auctions.forEach((item) => {
			if (!minPriceHash[item.item.id]) {
				if (item.buyout === 0) {
					minPriceHash[item.item.id] = item.bid / item.quantity / 10000;
				} else minPriceHash[item.item.id] = item.buyout / item.quantity / 10000;
			} else {
				if (
					minPriceHash[item.item.id] > item.buyout / item.quantity / 10000 &&
					item.buyout > 0
				) {
					minPriceHash[item.item.id] = item.buyout / item.quantity / 10000;
				}
			}
		});

	const sortedKeys = Object.keys(minPriceHash).sort((a, b) => {
		return minPriceHash[b] - minPriceHash[a];
	});

	return {
		sortedKeys: sortedKeys,
		auctions: minPriceHash,
	};
}
