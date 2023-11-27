import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
	_id: Number,
	name: {
		type: String,
		required: true,
		index: true,
	},
	levelReq: {
		type: Number,
		required: true,
	},
	itemLevel: {
		type: Number,
		required: true,
	},
	itemClass: {
		type: String,
		required: true,
		index: true,
	},
	itemSubclass: {
		type: String,
		required: true,
	},
	itemEquip: {
		type: String, //not required since some items do not have a itemEquip.name attribute. (Wands, Guns)
	},
	itemQuality: {
		type: String,
		required: true,
	},
	iconURL: {
		type: String,
		require: true,
	},
});

const Item = mongoose?.models?.Item || mongoose.model('Item', itemSchema);

module.exports = Item;
