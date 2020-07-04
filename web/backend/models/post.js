const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
	"author": {
		type: String,
		required: true
	},
	"description": {
		type: String,
		required: false
	},
	"media": {
		type: String,
		required: true
	},
	"permissions": {
		type: Array,
		required: true
	},
	"timestamp": {
		type: Number,
		default: Date.now()
	}
});

module.exports = mongoose.model('Post', schema);
