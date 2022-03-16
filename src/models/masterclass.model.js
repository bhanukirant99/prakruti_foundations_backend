const mongoose = require('mongoose');

var MasterSchema = new mongoose.Schema({
    title: String,
    description: String,
    timestamp: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    Content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    },
    instructor: String,
    aboutInstructor: String,
    price: Number,
    imageUrl: String,
    videoUrl: String,
    enrolledUsers: { type: Number, default: 0 },
    watchHours: Number,
});

module.exports = mongoose.model('Master', MasterSchema);