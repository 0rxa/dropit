const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
	"author": {
		type: String,
		required: true
	},
	"comments": {
		type: Array,
		required: false
	},
	"description": {
		type: String,
		required: false
	},
	"content": {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Post', schema);
