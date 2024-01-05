import mongoose from 'mongoose';

const wowTokenSchema = new mongoose.Schema({
	price: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
		index: true,
	},
});

const WowToken =
	mongoose?.models?.WowToken || mongoose.model('WowToken', wowTokenSchema);

export default WowToken;
