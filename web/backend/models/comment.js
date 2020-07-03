const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
	"author": {
		type: String,
		required: true
	},
	"post": {
		type: String,
		required: true
	},
	"content": {
		type: String,
		required: false
	},
	"timestamp": {
		type: Number,
		default: Date.now()
	}
});

module.exports = mongoose.model('Comment', schema);
