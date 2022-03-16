const { Course } = require('../models');
const { Content } = require('../models');
const mongoose = require('mongoose');
const { Note } = require('../models');
const httpStatus = require('http-status');

exports.get_all_notes = async(req, res) => {
    Note.find((err, notes) => {
        let message;
        if (notes.length >= 0) {
            message = "Notes offered"
        } else {
            message = "Sorry! There are no notes in this Contents."
        }
        res.send({
            message: message,
            notes: notes,
        });
    })
}

exports.get_all_content_notes = async(req, res) => {
    const contentID = req.params.contentID;

    var notes = await Note.find({ contentID })

    res.send(notes)
}

exports.create_newNote = (req, res) => {
    const contentID = req.params.contentID
    const newNote = new Note({
        note: req.body.note,
        contentID: contentID,
    })
    newNote.save((err, note) => {
        if (err) console.log(err)
        res.status(httpStatus.CREATED).send(newNote);
    })

}
exports.delete_note = (req, res) => {
    const noteID = req.params.noteID;
    note.findById(noteID, (err, note) => {
        note.remove();
        res.send("success")
    })
}