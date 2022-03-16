const express = require('express');
const masterController = require('../../controllers/masterclass.controller');

const router = express.Router();

router.get('/', masterController.get_all_courses)
router.get('/courseSingle/:courseID', masterController.get_single_course);

module.exports = router;