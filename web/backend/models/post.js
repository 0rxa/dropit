const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
	"name": {
		type: String,
		required: true
	},
	"description": {
		type: String,
		required: false
	},
	"media": {
		type: Object,
		required: true
	},
	"timestamp": {
		type: Number,
		default: Date.now()
	}
});

module.exports = mongoose.model('Post', schema);
