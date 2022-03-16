const mongoose = require('mongoose');
var commentSchema = new mongoose.Schema({
    comment: String,
    initialName: String,
    name: String,
    timestamp: { type: Date, default: Date.now },
    contentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;