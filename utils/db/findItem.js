import Item from '../../models/item';

export default async function findItem(id) {
	try {
		const result = await Item.findOne({ _id: id });
		if (result) return result;
		else {
			console.log('Could not find item: ' + id);
			addItemInfo(id);
			return result;
		}
	} catch (error) {
		console.log('Error getting data:', error);
	}
}
