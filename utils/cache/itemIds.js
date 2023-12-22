import cache from 'memory-cache';
import getAllItem from '../db/getAllItem';

export default async function RelevantItems() {
	const allItems = await getAllItem();
	return cache.put('allItems', allItems);
}
