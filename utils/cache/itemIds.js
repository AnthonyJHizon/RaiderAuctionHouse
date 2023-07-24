import cache from 'memory-cache';
import getAllItem from '../db/getAllItem';

module.exports = async function RelevantItems() {
	console.log('HERE');
	const allItems = await getAllItem();
	return cache.put('allItems', allItems);
};
