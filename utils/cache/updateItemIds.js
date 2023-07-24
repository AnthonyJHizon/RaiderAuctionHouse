import cache from 'memory-cache';

module.exports = async function UpdateItemIds(updatedItemSet) {
	return cache.put('allItems', updatedItemSet);
};
