const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post');

const schema = Schema({
	"username": {
		type: String,
		required: true,
        unique: true
	},
	"password": {
		type: String,
		required: true
	},
	"email": {
		type: String,
		required: true,
		required: true
	},
    "name": {
        type: String,
        required: true
    },
    "surname": {
        type: String,
        required: true
    },
    "folder": [{
        type: Schema.ObjectId,
        ref: "Post"
    }]
});

module.exports = mongoose.model('User', schema);
