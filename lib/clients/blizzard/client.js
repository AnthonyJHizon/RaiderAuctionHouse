import { cacheAccessToken, cacheUpdateAccessToken } from '../redis/client';

const MAX_RETRIES = 3;

export async function getWowTokenInfo() {
	const url =
		'https://us.api.blizzard.com/data/wow/token/index?namespace=dynamic-classic-us&locale=en_US';
	return await performRequest(url);
}

export async function getAuction(realmId, auctionId) {
	const url = `https://us.api.blizzard.com/data/wow/connected-realm/${realmId}/auctions/${auctionId}?namespace=dynamic-classic-us`;
	return await performRequest(url);
}

export async function getAuctionHouse(realmId) {
	const url = `https://us.api.blizzard.com/data/wow/connected-realm/${realmId}/auctions/index?namespace=dynamic-classic-us&locale=en_US`;
	return await performRequest(url);
}

export async function getItemInfo(itemId) {
	const url = `https://us.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US`;
	return await performRequest(url);
}

export async function getItemIcon(itemId) {
	const url = `https://us.api.blizzard.com/data/wow/media/item/${itemId}?namespace=static-classic-us&locale=en_US`;
	return await performRequest(url);
}

export async function getSearchConnectedRealm() {
	const url = `https://us.api.blizzard.com/data/wow/search/connected-realm?namespace=dynamic-classic-us`;
	return await performRequest(url);
}

export async function getToken() {
	try {
		const response = await fetch('https://us.battle.net/oauth/token', {
			method: 'POST',
			body: 'grant_type=client_credentials',
			headers: {
				Authorization:
					'Basic ' +
					Buffer.from(
						`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
					).toString('base64'),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
		const result = await response.json();
		return result.access_token;
	} catch (error) {
		return error;
	}
}

async function performRequest(url) {
	try {
		let accessToken = await cacheAccessToken();
		for (let i = 0; i < MAX_RETRIES; i++) {
			const response = await fetch(`${url}&access_token=${accessToken}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					accessToken = await cacheUpdateAccessToken();
					continue;
				} else if (response.status === 504 || response.status === 429) {
					continue;
				} else {
					throw new Error(`${response.status}: ${response.statusText}`);
				}
			}

			return response;
		}
	} catch (error) {
		return error;
	}
}
