const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');


const schema = Schema({
    "content": {
        type: String,
        required: true
    },
    "author": {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Comment', schema);
