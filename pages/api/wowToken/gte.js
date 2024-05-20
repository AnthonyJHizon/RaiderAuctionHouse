import { getWowTokenGTE } from '../../../lib/db/wowToken/get';

export default async function handler(req, res) {
	if (!req.query) {
		res.status(400).json({ erorr: 'Bad Request' });
		return;
	}
	try {
		const data = await getWowTokenGTE(req.query.days);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: 'Server Error' });
	}
}
