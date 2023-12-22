import mongoose from 'mongoose';

const accessTokenSchema = new mongoose.Schema({
	_id: Number,
	credentials: {
		type: String,
		required: true,
		index: true,
	},
});

const AccessToken =
	mongoose?.models?.AccessToken ||
	mongoose.model('AccessToken', accessTokenSchema);

export default AccessToken;
