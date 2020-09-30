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
        required: false
    },
    "desc": {
        type: String,
        required: false
    },
    "type": {
        type: Number,
        required: true
    },
    "isBookmarked": {
        type: Boolean,
        default: false
    },
    "comments": {
        type: [{
            type: Schema.ObjectId,
            ref: 'Comment'
        }],
        required: false
    }
});

module.exports = mongoose.model('Post', schema);
