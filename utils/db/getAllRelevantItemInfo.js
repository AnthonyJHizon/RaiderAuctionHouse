const getRelevantGemItemInfo = require('./getRelevantGemItemInfo');
const getRelevantConsumableItemInfo = require('./getRelevantConsumableItemInfo');
const getRelevantTradeGoodItemInfo = require('./getRelevantTradeGoodItemInfo');
const getRelevantGlyphItemInfo = require('./getRelevantGlyphItemInfo');
const connectToDatabase = require('./dbConnect');

export default async function getRelevevantItems() {
	try {
		await connectToDatabase();
		const results = await Promise.all([
			getRelevantGemItemInfo(),
			getRelevantConsumableItemInfo(),
			getRelevantTradeGoodItemInfo(),
			getRelevantGlyphItemInfo(),
		]);
		// const gemItemData = await getRelevantGemItemInfo();
		// const consumableItemData = await getRelevantConsumableItemInfo();
		// const tradeGoodItemData = await getRelevantTradeGoodItemInfo();
		// const glyphItemData = await getRelevantGlyphItemInfo();
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

		gemItemData.forEach((gem) => {
			if (gem.itemLevel >= 70) {
				relevantGems[gem._id] = gem.itemSubclass;
				relevantItemInfo[gem._id] = {
					name: gem.name,
					icon: gem.iconURL,
				};
			}
			if (!gemSubclasses[gem.itemSubclass]) {
				gemSubclasses[gem.itemSubclass] = gem.itemClass;
			}
		});
		consumableItemData.forEach((consumable) => {
			if (consumable.itemLevel >= 60) {
				relevantConsumables[consumable._id] = consumable.itemSubclass;
				relevantItemInfo[consumable._id] = {
					name: consumable.name,
					icon: consumable.iconURL,
				};
			}
			if (!consumableSubclasses[consumable.itemSubclass]) {
				consumableSubclasses[consumable.itemSubclass] = consumable.itemClass;
			}
		});
		tradeGoodItemData.forEach((tradeGood) => {
			if (tradeGood.itemLevel >= 60) {
				relevantTradeGoods[tradeGood._id] = tradeGood.itemSubclass;
				relevantItemInfo[tradeGood._id] = {
					name: tradeGood.name,
					icon: tradeGood.iconURL,
				};
			}
			if (!tradeGoodSubclasses[tradeGood.itemSubclass]) {
				tradeGoodSubclasses[tradeGood.itemSubclass] = tradeGood.itemClass;
			}
		});
		glyphItemData.forEach((glyph) => {
			relevantGlyphs[glyph._id] = glyph.itemSubclass;
			relevantItemInfo[glyph._id] = {
				name: glyph.name,
				icon: glyph.iconURL,
			};
			if (!glyphSubclasses[glyph.itemSubclass]) {
				glyphSubclasses[glyph.itemSubclass] = glyph.itemClass;
			}
		});

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
		return error;
	}
}
