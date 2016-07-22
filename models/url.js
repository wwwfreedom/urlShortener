const mongoose = require('mongoose')

// Define user model
let schemaOptions = {
  timestamps: true
};

let urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortenId: {type: String, unique: true, required: true}
}, schemaOptions)

const ModelClass = mongoose.model('url', urlSchema)

module.exports = ModelClass
