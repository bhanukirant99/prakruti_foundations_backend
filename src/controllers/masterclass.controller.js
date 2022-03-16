const { Master } = require('../models');
const { Content } = require('../models');
const { Comment } = require('../models')
const mongoose = require('mongoose');

exports.get_all_courses = async(req, res) => {
    var categories = await Content.find();
    Master.find((err, courses) => {
        let message;
        if (courses.length >= 0) {
            message = "Courses offered"
        } else {
            message = "Sorry! There are no courses in this Content."
        }
        res.send({
            message: message,
            courses: courses,
            categories: categories
        });
    }).select('-description -aboutInstructor')
}

exports.get_courses_of_Content = async(req, res) => {
    if (req.body.Content != undefined) {
        query = { Content: mongoose.Types.ObjectId(req.body.Content) }
    } else {
        query = {};
    }
    console.log(req.body.Content)
    var categories = await Content.find();
    Master.find(query, (err, courses) => {
        let message;
        if (courses.length >= 0) {
            message = "Courses offered"
        } else {
            message = "Sorry! There are no courses in this Content."
        }
        res.render('courses', {
            isLogged: req.session.isLogged,
            adminLogged: req.session.adminLogged,
            message: message,
            courses: courses,
            categories: categories
        });
    }).select('-description -aboutInstructor')
}


exports.get_single_course = async(req, res) => {
    const courseID = mongoose.Types.ObjectId(req.params.courseID.toString());
    var mostLikedCourses = await Master.find()
        .limit(4)
        .select('-description')
        .sort({ likes: 'desc' });


    var user;
    if (req.user_id != null && req.token != null) {
        user = await User.findById(req.user_id);
        var purchasedCourse = user.purchasedCourse;
        var alreadyPurchased = false;
        for (let i = 0; i < purchasedCourse.length; i++) {
            if (purchasedCourse[i].toString() == req.params.courseID.toString()) {
                alreadyPurchased = true;
            }
        }
    }
}