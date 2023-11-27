import Item from '../../models/item';

module.exports = async function getItemAllInfo() {
	try {
		const results = await Item.find({ itemClass: 'Trade Goods' });
		return results;
	} catch (error) {
		return error;
	}
};
