const express = require('express');
const likesController = require('../../controllers/like.controller');

const router = express.Router();

router.get('/', likesController.get_all_likes);
router.post('/:contentID', likesController.like_content);

module.exports = router;