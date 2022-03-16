const express = require('express');
const courseController = require('../../controllers/course.controller');

const router = express.Router();

router.get('/', courseController.get_all_courses);
router.get('/courseSingle/:courseID', courseController.get_single_course);
router.post('/create_newCourse', courseController.create_newCourse);
router.post('/enrollCourse/:courseID', courseController.enroll_course);

module.exports = router;