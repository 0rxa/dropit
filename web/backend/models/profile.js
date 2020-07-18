const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
	"posts": {
		type: Array,
		required: false
	},
	"members: {
		type: Array,
		required: true
	}
});

module.exports = mongoose.model('Profile', schema);
