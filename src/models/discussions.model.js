const mongoose = require('mongoose');
var discussionSchema = new mongoose.Schema({
    initialName: String,
    name: String,
    discussionTitle: String,
    discussionInfo: String,
    timestamp: { type: Date, default: Date.now },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Discussion', discussionSchema);