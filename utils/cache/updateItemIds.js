import cache from 'memory-cache';

export default async function UpdateItemIds(updatedItemSet) {
	return cache.put('allItems', updatedItemSet);
}
