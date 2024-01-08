import WowToken from '../../../models/wowToken';
import { getWowToken } from './get';

export async function addWowToken(price, timestamp) {
	try {
		const date = new Date(timestamp);
		const result = await getWowToken(date);
		if (result) {
			return;
		}
		const wowToken = {
			price: price / 10000,
			date: date,
		};
		return await WowToken.create(wowToken);
	} catch (error) {
		throw new Error(
			`Unable to add wow token: ${new Date(timestamp)}. ${error}`
		);
	}
}
