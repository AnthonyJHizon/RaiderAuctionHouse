import Item from '../../models/item';

export default async function getItemAllInfo() {
	try {
		const results = await Item.find({ itemClass: 'Trade Goods' });
		return results;
	} catch (error) {
		return error;
	}
}
