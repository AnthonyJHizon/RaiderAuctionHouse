import { getItem } from '../../../lib/db/item/get';
import addItem from '../../../lib/db/item/add';
import dbConnect from '../../../lib/db/dbConnect';

export default async function handler(req, res) {
	if (!req.query) {
		res.status(400).json({ erorr: 'Bad Request' });
		return;
	}
	try {
		await dbConnect();
		let item = {};
		let itemData = await getItem(req.query.id);
		if (!itemData) {
			itemData = await addItem(req.query.id);
		}
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
