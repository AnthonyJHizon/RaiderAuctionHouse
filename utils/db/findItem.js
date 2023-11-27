import Item from '../../models/item';

module.exports = async function findItem(id) {
	try {
		const result = await Item.findOne({ _id: id });
		if (result) return result;
		else return 'Could not find item: ' + id;
	} catch (error) {
		console.log('Error getting data:', error);
	}
};
