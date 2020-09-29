const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Batch = require('./batch');
const ScheduledPost = require('./scheduledPost');

const schema = Schema({
    "name": {
        type: String,
        required: true
    },
    "invite": [{
        type: Schema.ObjectId,
        ref: 'Invite'
    }],
    "owner": {
        type: Schema.ObjectId,
        ref: 'User'
    },
    "batches": [{
        type: Schema.ObjectId,
        ref: 'Batch'
    }],
    "calendar": [{
        type: Schema.ObjectId,
        ref: 'ScheduledPost'
    }],
    "members": [{
        type: Schema.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Channel', schema);
