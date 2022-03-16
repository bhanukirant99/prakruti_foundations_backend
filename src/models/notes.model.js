const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
    note: {
        type: String,
        default: "Programming is a mental sport which enables you to code a given problem under provided constraints"
    },
    timestamp: { type: Date, default: Date.now },
    contentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    },

});

module.exports = mongoose.model('Note', notesSchema);