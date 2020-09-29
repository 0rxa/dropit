const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Channel = require('./channel');

const schema = Schema({
    "sender": {
        type: Schema.ObjectId,
        ref: 'User'
    },
    "reciever": {
        type: Schema.ObjectId,
        ref: 'User'
    },
    "channel": {
        type: Schema.ObjectId,
        ref: 'Channel'
    },
    "isRequest": {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Invite', schema);
