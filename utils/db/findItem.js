const Item = require('../../models/item');

module.exports = async function findItem(id) {
	try {
		console.log('checking: ' + id);
		const results = await Item.find({ _id: id });
		console.log(results);
		if (results) return;
		else return id;
	} catch (error) {
		console.log('Error getting data', error);
	}
};
