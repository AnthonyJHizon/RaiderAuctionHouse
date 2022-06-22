const mongoose = require('mongoose');

const authorizationSchema = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true,
  }
})

const Authorization = mongoose.models.Authorization || mongoose.model("Authorization", authorizationSchema);

module.exports = Authorization;