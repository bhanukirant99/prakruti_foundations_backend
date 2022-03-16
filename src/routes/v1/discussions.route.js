const express = require('express');
const discussionController = require('../../controllers/discussions.controller');
const { discriminator } = require('../../models/discussions.model');

const router = express.Router();

router.get('/', discussionController.get_all_discussions);
router.get('/discussionsReply/:discussionID', discussionController.get_all_discussionsReply);
router.post('/create_newDiscussion/:userID', discussionController.create_newDiscussion);
router.post('/create_newDiscussionReply/:discussionID', discussionController.create_newDiscussionReply);

module.exports = router;