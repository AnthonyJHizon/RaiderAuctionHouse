import WowToken from '../../../models/wowToken';
import dbConnect from '../dbConnect';

export async function getWowToken(date) {
	try {
		const result = await WowToken.findOne({ date: date });
		return result;
	} catch (error) {
		throw new Error(`Unable to add wow token: ${date}. ${error}`);
	}
}

export async function getWowTokenGTE(numDays) {
	try {
		await dbConnect();
		let date = new Date();
		date.setDate(date.getDate() - numDays);
		const result = await WowToken.find(
			{
				date: { $gte: date },
			},
			{ _id: 0, price: 1, date: 1 }
		).sort({ date: 1 });
		return result;
	} catch (error) {
		throw new Error(`Unable to get wow token data range: ${numDays}. ${error}`);
	}
}
