import connectToDatabase from '../../../utils/db/dbConnect';
import findItem from '../../../utils/db/findItem';

export default async function handler(req, res) {
	if (!req.query) {
		res.status(400).json({ erorr: 'Bad Request' });
		return;
	}
	try {
		await connectToDatabase();
		const item = {};
		const itemData = await findItem(req.query.id);
		item[itemData._id] = {
			name: itemData.name,
			icon: itemData.iconURL,
		};
		res.status(200).json(item);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Server Error' });
	}
}
