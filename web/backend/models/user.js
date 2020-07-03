const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
	"name": {
		type: String,
		required: true
	},
	"password": {
		type: String,
		required: false
	},
	"email": {
		type: String,
		default: Date.now()
	}
});

module.exports = mongoose.model('User', schema);
