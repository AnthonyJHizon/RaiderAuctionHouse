const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: Number,
    required: true,
  },
  pictureURL: {
    type: String,
    require: true,
  }
})

const Authorization = mongoose.model("Authorization", itemSchema);

module.exports = Authorization;