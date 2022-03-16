const mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
    courseTitle: String,
    courseInfo: String,
    courseDescription: {
        type: String,
        default: "Competitive Programming helps you become a great Programmer and crack coding interviews and competitons. In this program you will learn Competitive Programming helps you become a great Programmer and crack coding interviews and competitons. In this program you will learn"
    },
    timestamp: { type: Date, default: Date.now },
    courseContents: {
        type: Array,
        default: []
    },
    price: {
        type: String,
        default: 1000
    },
    courseImage: {
        type: String,
        default: "https://media.istockphoto.com/photos/laptop-and-code-background-learn-programming-language-computer-picture-id1299990773?s=612x612"
    },
    enrolledUsers: { type: Number, default: 0 },
    watchHours: { type: Number, default: 50 },
});

module.exports = mongoose.model('Course', CourseSchema);