const express = require('express');
const notesController = require('../../controllers/notes.controller');

const router = express.Router();

router.get('/', notesController.get_all_notes);
router.get('/:contentID', notesController.get_all_content_notes);
router.post('/create_newNote/:contentID', notesController.create_newNote);

module.exports = router;