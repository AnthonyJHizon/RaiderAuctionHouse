import Item from '../../models/item';

export default async function getAllItemInfo() {
	try {
		let allItemId = new Set();
		const results = await Item.find({});
		results.forEach((item) => {
			allItemId.add(item.id);
		});
		return allItemId;
	} catch (error) {
		console.log('Error getting data', error);
	}
}
