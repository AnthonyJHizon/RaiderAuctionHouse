import cache from 'memory-cache';
import getAllRelevantItemInfo from '../db/getAllRelevantItemInfo';

module.exports = async function RelevantItems() {
	const relevantItems = getAllRelevantItemInfo();
	return cache.put('relevantItems', relevantItems, 8.64e7 * 3);
};
