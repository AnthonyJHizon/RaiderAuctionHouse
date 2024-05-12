import { Redis } from 'ioredis';

import {
	getAuctionHouse,
	getSearchConnectedRealm,
	getToken,
} from '../blizzard/client';

import { getAllItems, getRelevantItems } from '../../db/item/get';

import cacheFormatAuctionHousesData from '../../../utils/formatData/cache/auctionHouse';
import cacheFormatRealmData from '../../../utils/formatData/cache/realm';

const redisURL = process.env.REDIS_URL ?? 'redis://redis:6379';

const redis = new Redis(redisURL, { lazyConnect: true });

export async function cacheGet(value) {
	const result = await redis.get(value);
	if (result) {
		if (typeof result === String) {
			return result;
		} else return JSON.parse(result);
	} else return null;
}

export async function cacheSet(key, value, expiresIn) {
	if (value instanceof Set) value = JSON.stringify([...value]);
	else if (value !== String) value = JSON.stringify(value);
	if (expiresIn) await redis.set(key, value, 'Ex', expiresIn);
	else await redis.set(key, value);
	return;
}

export async function cachedAunctionHouses() {
	const result = await cacheGet('auctionHouses');
	if (result) {
		return result;
	} else {
		const response = await getAuctionHouse('4728');
		let data = await response.json();
		data = await cacheFormatAuctionHousesData(data);
		await cacheSet('auctionHouses', data, 8.64e7 * 3);
		// console.log(data);
		// console.log(JSON.parse(await redis.get('auctionHouses')));
		return data;
	}
}

export async function cachedRealms() {
	const result = await cacheGet('realms');
	if (result) {
		return result;
	} else {
		const response = await getSearchConnectedRealm();
		let data = await response.json();
		data = await cacheFormatRealmData(data);
		await cacheSet('realms', data, 8.64e7 * 3);
		// console.log(data);
		// console.log(JSON.parse(await redis.get('realms')));
		return data;
	}
}

export async function cachedRelevantItems() {
	const result = await cacheGet('relevantItems');
	if (result) {
		return result;
	} else {
		const data = await getRelevantItems();
		await cacheSet('relevantItems', data, 8.64e7 * 3);
		// console.log(data);
		// console.log(JSON.parse(await redis.get('relevantItems')));
		return data;
	}
}

export async function cachedItemIds() {
	const result = await redis.get('allItems');
	if (result) {
		return new Set(JSON.parse(result));
	} else {
		const data = await getAllItems();
		await cacheSet('allItems', data);
		return data;
	}
}

export async function cacheUpdateAllItemIds(updatedItemSet) {
	await cacheSet('allItems', updatedItemSet);
	return updatedItemSet;
}

export async function cacheAccessToken() {
	const result = await cacheGet('accessToken');
	if (result) {
		return result;
	} else {
		const data = await cacheUpdateAccessToken();
		return data;
	}
}

export async function cacheUpdateAccessToken() {
	const data = await getToken();
	await cacheSet('accessToken', data, 8.64e7);
	return data;
}
