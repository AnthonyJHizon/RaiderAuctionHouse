import Item from '../../models/item';

module.exports = async function getAllGemItemInfo() {
	try {
		const results = await Item.find({ itemClass: 'Gem' });
		return results;
	} catch (error) {
		return error;
	}
};
