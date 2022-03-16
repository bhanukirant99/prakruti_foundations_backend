const { Content } = require('../models');
const httpStatus = require('http-status');

exports.get_all_contents = async(req, res) => {
    Content.find((err, contents) => {
        let message;
        if (contents.length >= 0) {
            message = "Contents offered"
        } else {
            message = "Sorry! There are no courses in this Contents."
        }
        res.send({
            message: message,
            contents: contents,
        });
    })
}

exports.get_all_course_contents = async(req, res) => {

    const courseID = req.params.courseID;
    console.log(courseID)

    var contents = await Content.find({ courseID })
        .populate('courseID')

    res.send(contents)
}

exports.create_newContent = async(req, res) => {
    const courseID = req.params.courseID
    newContent = await new Content({
        classTitle: req.body.classTitle,
        courseID: courseID,
        classVideo: req.body.classVideo,
        classDuration: req.body.classDuration,
    })
    newContent.save((err, content) => {
        if (err) console.log(err)
        res.status(httpStatus.CREATED).send(newContent);
    })
}

exports.delete_content = (req, res) => {
    const contentID = req.params.contentID;
    Content.findById(contentID, (err, content) => {
        content.remove();
        res.send("success")
    })
}