const express = require('express');
const contentController = require('../../controllers/content.controller');

const router = express.Router();

router.get('/', contentController.get_all_contents);
router.get('/:courseID', contentController.get_all_course_contents);
// router.get('/courseSingle/:courseID', contentController.get_single_course);
router.post('/create_newContent/:courseID', contentController.create_newContent);
// router.post('/enrollCourse/:courseID', contentController.enroll_course);

module.exports = router;