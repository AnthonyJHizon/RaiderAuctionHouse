import cache from 'memory-cache';
import getAllItem from '../db/getAllItem';

module.exports = async function RelevantItems() {
	const allItems = await getAllItem();
	return cache.put('allItems', allItems);
};
