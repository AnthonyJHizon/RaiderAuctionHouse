import { getWowTokenInfo } from '../../../lib/clients/blizzard/client';
import { addWowToken } from '../../../lib/db/wowToken/add';
import dbConnect from '../../../lib/db/dbConnect';

export default async function handler(req, res) {
	try {
		await dbConnect();
		const response = await getWowTokenInfo();
		const data = await response.json();

		await addWowToken(data.price, data.last_updated_timestamp);

		return res.status(200).json({
			message: 'Finished querying and adding wow token price',
			success: true,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Server Error' });
	}
}
