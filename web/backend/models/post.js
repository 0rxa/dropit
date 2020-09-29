const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

const schema = Schema({
    "link": {
        type: String,
        required: true
    },
    "name": {
        type: String,
        required: true
    },
    "desc": {
        type: String,
        required: true
    },
    "type": {
        type: Number,
        required: true
    },
    "isBookmarked": {
        type: Boolean,
        default: false
    },
    "comments": [{
        type: Schema.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Post', schema);
