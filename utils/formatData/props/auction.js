export default async function Auction(data) {
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
	return minPriceHash;
}
