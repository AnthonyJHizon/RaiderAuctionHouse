import WowToken from '../../../models/wowToken';

export async function getWowToken(date) {
	try {
		const result = await WowToken.findOne({ date: date });
		return result;
	} catch (error) {
		throw new Error(`Unable to add wow token: ${date}. ${error}`);
	}
}
