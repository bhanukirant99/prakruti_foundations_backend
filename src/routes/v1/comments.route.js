const express = require('express');
const commentsController = require('../../controllers/comments.controller');

const router = express.Router();

router.get('/', commentsController.get_all_comments);
router.get('/:contentID', commentsController.get_all_content_comments);
router.post('/create_newComment/:contentID', commentsController.create_newComment);

module.exports = router;