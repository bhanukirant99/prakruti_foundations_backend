const mongoose = require('mongoose');
var likeSchema = new mongoose.Schema({
    like: {
        type: Boolean,
        default: false
    },
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

module.exports = mongoose.model('Like', likeSchema);