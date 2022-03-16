const { Discussion } = require('../models')
const { DiscussionReply } = require('../models')
const httpStatus = require('http-status');

exports.get_all_discussions = async(req, res) => {
    Discussion.find((err, discussions) => {
        let message;
        if (discussions.length >= 0) {
            message = "discussions offered"
        } else {
            message = "Sorry! There are no discussions in this Contents."
        }
        res.send({
            message: message,
            discussions: discussions,
        });
    })
}

exports.create_newDiscussion = (req, res) => {
    const userID = req.params.userID;
    const newDiscussion = new Discussion({
        discussionTitle: req.body.discussionTitle,
        discussionInfo: req.body.discussionInfo,
        userID: userID,
        initialName: req.body.initialName,
        name: req.body.name,
    })
    newDiscussion.save((err, discussion) => {
        if (err) console.log(err)
        res.status(httpStatus.CREATED).send(newDiscussion);
    })
}

exports.get_all_discussionsReply = async(req, res) => {
    const discussionID = req.params.discussionID;

    var discussionsReply = await DiscussionReply.find({ discussionID })
        .populate('userID')

    res.send(discussionsReply)
}

exports.create_newDiscussionReply = (req, res) => {
    const discussionID = req.params.discussionID;
    const newDiscussionReply = new DiscussionReply({
        discussionReply: req.body.discussionReply,
        userID: req.body.userID,
        discussionID: discussionID,
        initialName: req.body.initialName,
        name: req.body.name,
    })
    newDiscussionReply.save((err, discussionReply) => {
        if (err) console.log(err)
        res.status(httpStatus.CREATED).send(newDiscussionReply);
    })
}


exports.delete_discussion = (req, res) => {
    const discussionID = req.params.discussionID;
    discussion.findById(discussionID, (err, discussion) => {
        discussion.remove();
        res.send("success")
    })
}