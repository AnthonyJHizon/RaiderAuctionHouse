const mongoose = require('mongoose');

module.exports = async () => {
	mongoose.set('strictQuery', false);
	mongoose.connect(process.env.MONGODB_URI);
};
