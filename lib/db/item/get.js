import Item from '../../../models/item';

import formatRelevantItems from '../../../utils/formatData/props/relevantItem';

export async function getItem(id) {
	try {
		const result = await Item.findOne({ _id: id });
		return result;
	} catch (error) {
		console.log(error);
		throw new Error(`Unable to get item information, item: ${id}. ${error}`);
	}
}

export async function getSearchItems(searchInput) {
	try {
		searchInput = searchInput.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		const results = await Item.find({
			name: { $regex: searchInput, $options: 'i' },
		});
		return results;
	} catch (error) {
		throw new Error(
			`Unable to get searched items, search: ${searchInput}. ${error}`
		);
	}
}

export async function getItemsByClass(itemClass, itemLevel) {
	try {
		const results = await Item.find({
			itemClass: itemClass,
			itemLevel: { $gte: itemLevel ?? 0 },
		});
		return results;
	} catch (error) {
		throw new Error(`Unable to get items by class: ${itemClass}. ${error}`);
	}
}

export async function getRelevantItems() {
	try {
		const results = await Promise.all([
			getItemsByClass('Gem', 70),
			getItemsByClass('Consumable', 60),
			getItemsByClass('Trade Goods', 60),
			getItemsByClass('Glyph'),
		]);

		const gemItemData = results[0];
		const consumableItemData = results[1];
		const tradeGoodItemData = results[2];
		const glyphItemData = results[3];

		let relevantItemData = {};
		let relevantItems = {};
		let relevantItemInfo = {};

		let relevantGems = {};
		let relevantConsumables = {};
		let relevantTradeGoods = {};
		let relevantGlyphs = {};

		let gemSubclasses = {};
		let consumableSubclasses = {};
		let tradeGoodSubclasses = {};
		let glyphSubclasses = {};

		formatRelevantItems(
			gemItemData,
			relevantGems,
			relevantItemInfo,
			gemSubclasses
		);
		formatRelevantItems(
			consumableItemData,
			relevantConsumables,
			relevantItemInfo,
			consumableSubclasses
		);
		formatRelevantItems(
			tradeGoodItemData,
			relevantTradeGoods,
			relevantItemInfo,
			tradeGoodSubclasses
		);
		formatRelevantItems(
			glyphItemData,
			relevantGlyphs,
			relevantItemInfo,
			glyphSubclasses
		);

		relevantItems['gems'] = relevantGems;
		relevantItems['consumables'] = relevantConsumables;
		relevantItems['tradeGoods'] = relevantTradeGoods;
		relevantItems['glyphs'] = relevantGlyphs;

		relevantItems['gemSubclasses'] = gemSubclasses;
		relevantItems['consumableSubclasses'] = consumableSubclasses;
		relevantItems['tradeGoodSubclasses'] = tradeGoodSubclasses;
		relevantItems['glyphSubclasses'] = glyphSubclasses;

		relevantItems['itemClasses'] = [
			'Gems',
			'Consumables',
			'Trade Goods',
			'Glyphs',
		];

		relevantItemData['relevantItemSubclasses'] = relevantItems;
		relevantItemData['relevantItemInfo'] = relevantItemInfo;

		return relevantItemData;
	} catch (error) {
		throw new Error(`Unable to get relevant items. ${error}`);
	}
}

export async function getAllItems() {
	try {
		let allItemId = new Set();
		const results = await Item.find({});
		results.forEach((item) => {
			allItemId.add(item.id);
		});
		return allItemId;
	} catch (error) {
		throw new Error(`Unable to get all items, ${error}`);
	}
}
