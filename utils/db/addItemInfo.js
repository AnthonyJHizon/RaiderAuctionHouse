import getAccessToken from '../db/getAccessToken';
import Item from '../../models/item';

module.exports = async function addItemInfo(itemId) {
	try {
		const accessToken = await getAccessToken();
		const itemDataRes = await fetch(
			`https://us.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US&&locale=en_US&access_token=${accessToken}`
		);
		const itemData = await itemDataRes.json();
		const name = itemData.name;
		const levelReq = itemData.required_level;
		const itemLevel = itemData.level;
		const itemClass = itemData.item_class.name;
		const itemSubclass = itemData.item_subclass.name;
		const itemEquip = itemData.inventory_type.name;
		const itemQuality = itemData.quality.name;
		const iconRes = await fetch(
			`https://us.api.blizzard.com/data/wow/media/item/${itemId}?namespace=static-classic-us&locale=en_US&access_token=${accessToken}`
		);
		const iconData = await iconRes.json();
		const iconResult = iconData.assets[0].value;

		const item = {
			_id: itemId,
			name: name,
			levelReq: levelReq,
			itemLevel: itemLevel,
			itemClass: itemClass,
			itemSubclass: itemSubclass || '', //some items do not have a subclass
			itemEquip: itemEquip || '', //some items can not be equiped
			itemQuality: itemQuality,
			iconURL: iconResult,
		};
		await Item.create(item);
	} catch (error) {
		if (error.response) {
			if (error.response.status === 404) {
				//item was not found in api, make "Deprecated" item to add to Item
				const item = {
					_id: itemId,
					name: 'Deprecated',
					levelReq: -1,
					itemLevel: -1,
					itemClass: 'Deprecated',
					itemSubclass: 'Deprecated',
					itemEquip: 'Deprecated',
					itemQuality: 'Deprecated',
					iconURL: 'Deprecated',
				};
				await Item.create(item);
			}
		}
		const accessToken = await getAccessToken();
		console.log(error + ' ' + itemId);
		console.log(
			`https://us.api.blizzard.com/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US&&locale=en_US&access_token=${accessToken}`
		);
	}
};
