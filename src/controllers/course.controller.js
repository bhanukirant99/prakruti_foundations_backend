const { Course } = require('../models');
const { Content } = require('../models');
const { Comment } = require('../models')
const mongoose = require('mongoose');
const { User } = require('../models');
const httpStatus = require('http-status');

exports.get_all_courses = async(req, res) => {
    Course.find((err, courses) => {
        let message;
        if (courses.length >= 0) {
            message = "Courses offered"
        } else {
            message = "Sorry! There are no courses in this Content."
        }
        res.send({
            message: message,
            courses: courses,
        });
    }).select('-description -aboutInstructor')
}

exports.get_courses_of_Content = async(req, res) => {
    let query = {};
    if (req.body.Content) {
        query = { Content: mongoose.Types.ObjectId(req.body.Content) }
    }
    console.log(req.body.Content)
    const categories = await Content.find();
    try {
        const courses = await Course.find(query).select('-description -aboutInstructor')
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
    } catch (e) {
        res.status(httpStatus.CREATED).send(e);
    }

}


exports.get_single_course = async(req, res) => {
    const courseID = mongoose.Types.ObjectId(req.params.courseID.toString());

    Course.findById(courseID, (err, course) => {
        if (err) {
            console.log(err)
        } else {
            return res.send({
                course: course,
            });
        }
    })

}

exports.enroll_course = async(req, res) => {
    const userID = req.body.user_id;
    if (userID != null) {
        const user = await User.findById(userID);
        const courseID = req.params.courseID;

        //Add courseID in purchased courses of user
        user.purchasedCourse.push(courseID.toString())
        console.log("in progress")
        user.save((err, user) => {
            if (err) {
                console.log(err);
            }

            //increasing the number of enrolled people in courses
            Course.findById(courseID, (err, course) => {
                course.enrolledUsers = course.enrolledUsers + 1;
                course.save();
            }).select('-description -aboutInstructor')
            res.status(200).send(user);

        })
    } else {
        res.send(400).send("Please Provide a User ID")
    }

}

exports.create_newCourse = (req, res) => {
    const newCourse = new Course({
        courseTitle: req.body.courseTitle,
        courseInfo: req.body.courseInfo,
        courseDescription: req.body.courseDescription,
        courseImage: req.body.courseImage,
    })
    newCourse.save((err, course) => {
        if (err) console.log(err)
        res.status(httpStatus.CREATED).send(newCourse);
    })
}

exports.get_myCourses_page = (req, res) => {
    User.findById(req.session.user_id, (err, user) => {
        if (err) console.log(err)

        var purchasedCourseIds = user.purchasedCourse;
        Course.find({ '_id': { $in: purchasedCourseIds } }, async(err, courses) => {
            if (err) console.log(err)

            //find whether course is liked or not
            const size = await User.aggregate([{ $match: { _id: req.session.user_id } }, { $project: { courses: { $size: '$likedCourses' } } }])
            var likedCourses = (size[0].courses > 0) ? user.likedCourses : [];
            var Liked = []
            var alreadyLiked;
            for (let i = 0; i < courses.length; i++) {
                alreadyLiked = false;
                for (let j = 0; j < likedCourses.length; j++) {
                    if (likedCourses[j].toString() == courses[i]._id.toString()) {
                        alreadyLiked = true;
                    }
                }
                Liked[i] = alreadyLiked
            }


            return res.render('myCourses', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                courses: courses,
                Liked: Liked
            })
        }).select('-description -aboutInstructor')
    })
}


exports.verify_payment = async(req, res) => {
    const user = await User.findById(req.session.user_id);
    const courseID = req.params.courseID;
    var signature = req.body.razorpay_signature;

    //validating the signature
    const crypto = require('crypto');
    var generated_signature = crypto.createHmac('SHA256', process.env.RAZORPAY_SECRET)
        .update(req.body.order_id + "|" + req.body.razorpay_payment_id)
        .digest('hex');
    console.log(generated_signature)
    console.log(signature)
    if (generated_signature == signature) {
        console.log("payment is successful")
            //Add courseID in purchased courses of user
        user.purchasedCourse.push(courseID.toString())
        user.save((err, user) => {
            if (err) {
                console.log(err);
                //initiate refund
            }

            //create a new transaction to keep records
            const newTrans = Transaction({
                amount: req.body.amount,
                courseID: courseID,
                userID: user._id,
                razorpay_payment_id: req.body.razorpay_payment_id,
                razorpay_order_id: req.body.order_id
            })
            newTrans.save();

            //increasing the number of enrolled people in courses
            Course.findById(courseID, (err, course) => {
                course.enrolledUsers = course.enrolledUsers + 1;
                course.save();
            }).select('-description -aboutInstructor')

        })

        res.redirect('/myCourses');
    } else {
        console.log('payment failed');
        res.redirect('/checkout/' + courseID)
    }
}

exports.get_checkout_page = async(req, res) => {
    const user = await User.findById(req.session.user_id);
    const courseID = req.params.courseID;
    Course.findById(courseID, (err, course) => {
        if (err) {
            return res.render('checkout', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Some error occured. Please try again.",
                course: null
            })
        }

        //razor pay order id
        var options = {
            amount: course.price * 100, // amount in the smallest currency unit
            currency: "INR",
        };
        instance.orders.create(options, function(err, order) {
            console.log(order);
            return res.render('checkout', {
                userName: user.name,
                amount: course.price,
                userEmail: user.email,
                order_id: order.id,
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                message: "Select wide range of online payment options using Razorpay.(UPI/ Net Banking/ Credit Card/ Debit Card/ External Wallets",
                course: course
            })
        });
    }).select('-description -aboutInstructor')
}

exports.like_update = async(req, res) => {
    const courseID = req.params.courseID;
    const user = await User.findById(req.session.user_id);
    const size = await User.aggregate([{ $match: { _id: req.session.user_id } }, { $project: { courses: { $size: '$likedCourses' } } }])
    var likedCourses = (size[0].courses > 0) ? user.likedCourses : [];
    var alreadyLiked = false;
    for (let i = 0; i < likedCourses.length; i++) {
        if (likedCourses[i].toString() == courseID.toString()) {
            alreadyLiked = true;
        }
    }
    if (!alreadyLiked) {
        const course = await Course.findById(courseID);
        course.likes = course.likes + 1;
        user.likedCourses.push(courseID);
        user.save(() => {
            course.save(() => {
                return res.redirect('/myCourses');
            })
        });
    } else {
        //filter arrat to contain only those courseid not equal to one passed in parameter
        user.likedCourses = user.likedCourses.filter((value) => {
            if (value != courseID) {
                return value;
            }
        });
        const course = await Course.findById(courseID);
        course.likes = course.likes - 1;
        user.save(() => {
            course.save(() => {
                return res.redirect('/myCourses');
            })
        });
    }
}

exports.get_watchCourse_page = async(req, res) => {
    var trackNum = req.query.trackNum ? req.query.trackNum : 0;
    console.log(trackNum)
    Course.findById(req.params.courseID, (err, course) => {
        const directoryPath = path.join(__dirname, '../course-videos', course.videoUrl);
        //passsing directoryPath and callback function
        var courseTracks = []
        fs.readdir(directoryPath, function(err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            //listing all files using forEach
            files.forEach(function(file) {
                courseTracks.push(file.toString());
            });


            return res.render('watchCourse', {
                isLogged: req.session.isLogged,
                adminLogged: req.session.adminLogged,
                courseID: req.params.courseID,
                path: path.join(directoryPath, courseTracks[trackNum]),
                imageUrl: course.imageUrl,
                trackNum: trackNum,
                courseTracks: courseTracks
            });
        });


    })

}

exports.create_comment = (req, res) => {
    const courseID = req.params.courseID
    const newComment = Comment({
        comment: req.body.comment,
        courseID: courseID,
        userID: req.session.user_id
    })
    newComment.save(() => {
        res.redirect('/courseSingle/' + courseID)
    })
}

exports.delete_comment = (req, res) => {
    const commentID = req.params.commentID;
    Comment.findById(commentID, (err, comment) => {
        comment.remove();
        res.redirect('/courses')
    })
}