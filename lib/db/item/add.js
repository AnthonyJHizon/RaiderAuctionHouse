import Item from '../../../models/item';

import { getItemInfo, getItemIcon } from '../../clients/blizzard/client';

export default async function addItem(id) {
	try {
		const itemDataRes = await getItemInfo(id);
		const iconRes = await getItemIcon(id);

		if (itemDataRes.status === 200 && iconRes.status === 200) {
			const itemData = await itemDataRes.json();
			const iconData = await iconRes.json();

			const name = itemData.name;
			const levelReq = itemData.required_level;
			const itemLevel = itemData.level;
			const itemClass = itemData.item_class.name;
			const itemSubclass = itemData.item_subclass.name;
			const itemEquip = itemData.inventory_type.name;
			const itemQuality = itemData.quality.name;
			const iconResult = iconData.assets[0].value;

			const item = {
				_id: id,
				name: name,
				levelReq: levelReq,
				itemLevel: itemLevel,
				itemClass: itemClass,
				itemSubclass: itemSubclass || '', //some items do not have a subclass
				itemEquip: itemEquip || '', //some items can not be equiped
				itemQuality: itemQuality,
				iconURL: iconResult,
			};
			return await Item.create(item);
		} else if (itemDataRes.status === 404) {
			//item was not found in api, make "Deprecated" item to add to Item
			const item = {
				_id: id,
				name: 'Deprecated',
				levelReq: -1,
				itemLevel: -1,
				itemClass: 'Deprecated',
				itemSubclass: 'Deprecated',
				itemEquip: 'Deprecated',
				itemQuality: 'Deprecated',
				iconURL: 'Deprecated',
			};
			return await Item.create(item);
		} else {
			throw new Error(
				`Unable to add item, item: ${id}. ${itemDataRes.status}: ${itemDataRes.statusText}`
			);
		}
	} catch (error) {
		return error;
	}
}
