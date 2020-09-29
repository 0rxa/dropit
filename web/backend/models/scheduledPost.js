const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post');

const schema = Schema({
    "post": {
        type: Schema.ObjectId,
        ref: 'Post'
    },
    scheduledTime: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('ScheduledPost', schema);
