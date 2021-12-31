const getItemInfo = require('./getItemInfo');
const addItemInfo = require('./addItemInfo');

module.exports = async function queryDBItems(key) {
	try {
		itemInfo = await getItemInfo(key)
		console.log(key);
		if(itemInfo === null) {
			itemInfo = await addItemInfo(key);
			console.log(key);
			// console.log(itemInfo);
			console.log("newItem: ", itemInfo.name);
		}
	} catch (error) {
		console.log(error);
	}
}