const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
	"name": {
		type: String,
		required: true
	},
	"password": {
		type: String,
		required: true
	},
	"email": {
		type: String,
		required: true
	},
	"profiles": {
		type: Array,
		required: false
	}
});

module.exports = mongoose.model('User', schema);
