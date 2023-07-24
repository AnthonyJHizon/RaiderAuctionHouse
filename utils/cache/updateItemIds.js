import cache from 'memory-cache';

module.exports = async function UpdateItemIds(updatedItemSet) {
	console.log('update');
	return cache.put('allItems', updatedItemSet);
};
