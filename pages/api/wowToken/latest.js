import { getWowTokenLatest } from '../../../lib/db/wowToken/get';

export default async function handler(req, res) {
	try {
		const data = await getWowTokenLatest();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: 'Server Error' });
	}
}
