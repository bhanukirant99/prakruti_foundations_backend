const mongoose = require('mongoose');
var discussionReply = new mongoose.Schema({
    initialName: String,
    name: String,
    discussionReply: String,
    timestamp: { type: Date, default: Date.now },
    discussionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion'
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const DiscussionReply = mongoose.model('discussionReply', discussionReply);
module.exports = DiscussionReply;