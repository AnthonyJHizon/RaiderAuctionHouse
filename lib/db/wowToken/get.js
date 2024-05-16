import WowToken from '../../../models/wowToken';
import dbConnect from '../dbConnect';

export async function getWowTokenLatest() {
	try {
		await dbConnect();
		const result = await WowToken.findOne().sort({ _id: -1 });
		return result;
	} catch (error) {
		throw new Error(`Unable to get latest wow token: ${error}`);
	}
}

export async function getWowToken(date) {
	try {
		const result = await WowToken.findOne({ date: date });
		return result;
	} catch (error) {
		throw new Error(`Unable to get wow token: ${date}. ${error}`);
	}
}

export async function getWowTokenGTE(numDays) {
	try {
		await dbConnect();

		let date = new Date();

		if (numDays === 'MAX')
			return await WowToken.find().sort({
				date: 1,
			});
		else if (numDays === 'YTD') date.setFullYear(date.getFullYear() - 1);
		else if (numDays === '6M') date.setMonth(date.getMonth() - 6);
		else if (numDays === '1M') date.setMonth(date.getMonth() - 1);
		else if (numDays === '7D') date.setDate(date.getDate() - 7);
		else date.setDate(date.getDate() - 1);

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
