const mongoose = require('mongoose');

module.exports = async () => mongoose.connect(process.env.MONGODB_URI);
