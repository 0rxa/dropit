const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Post = require('./post');

const schema = Schema({
    "author": {
        type: Schema.ObjectId,
        ref: 'User'
    },
    "timetamp": {
        default: Date.now()
    },
    "posts": [{
        type: Schema.ObjectId,
        ref: 'Post'
    }],
    "isArchived": {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Batch', schema);
