const { Comment } = require('../models')
const httpStatus = require('http-status');

exports.get_all_comments = async(req, res) => {
    Comment.find((err, comments) => {
        let message;
        if (comments.length >= 0) {
            message = "comments got"
        } else {
            message = "Sorry! There are no comments in this Contents."
        }
        res.send({
            message: message,
            comments: comments,
        });
    })
}

exports.get_all_content_comments = async(req, res) => {
    const contentID = req.params.contentID;

    var comments = await Comment.find({ contentID })
        .populate('userID')

    res.send(comments)
}

exports.create_newComment = (req, res) => {
    const contentID = req.params.contentID
    const newComment = new Comment({
        comment: req.body.comment,
        contentID: contentID,
        userID: req.body.userID,
        initialName: req.body.initialName,
        name: req.body.name
    })
    newComment.save((err, comment) => {
        if (err) console.log(err)
        res.status(httpStatus.CREATED).send(newComment);
    })
}

exports.delete_comment = (req, res) => {
    const commentID = req.params.commentID;
    Comment.findById(commentID, (err, comment) => {
        comment.remove();
        res.send("success")
    })
}