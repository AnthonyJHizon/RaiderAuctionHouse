import connectToDatabase from '../../../lib/db/dbConnect';
import { getSearchItems } from '../../../lib/db/item/get';

export default async function handler(req, res) {
	if (!req.query) {
		res.status(400).json({ erorr: 'Bad Request' });
		return;
	}
	try {
		await connectToDatabase();
		let searchItems = {};
		const searchItemData = await getSearchItems(req.query.item);
		searchItemData.forEach((item) => {
			searchItems[item._id] = {
				name: item.name,
				icon: item.iconURL,
			};
		});
		res.status(200).json(searchItems);
	} catch (error) {
		res.status(500).json({ error: 'Server Error' });
	}
}
