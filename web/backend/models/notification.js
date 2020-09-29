const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const schema = Schema({
    "type": {
        type: Number,
        required: true
    },
    "link": {
        type: String,
        required: true
    },
    "timestamp": {
        default: Date.now()
    },
    "sender": {
        type: Schema.ObjectId,
        ref: 'User'
    },
    "channel": {
        type: Schema.ObjectId,
        ref: 'Channel'
    }
});

module.exports = mongoose.model('Notification', schema);
