import connectToDatabase from './dbConnect';
import findItem from './findItem';

module.exports = async function loadInitialAuctions(auctions) {
	if (auctions) {
		await connectToDatabase();
		const end = 20;
		let newItemData = {};
		await Promise.all(
			Object.keys(auctions)
				.slice(0, end)
				.map(async (id) => {
					let item = {};
					const itemData = await findItem(id);
					item[itemData._id] = {
						name: itemData.name,
						icon: itemData.iconURL,
					};
					Object.assign(newItemData, item);
				})
		);
		return newItemData;
	}
};
