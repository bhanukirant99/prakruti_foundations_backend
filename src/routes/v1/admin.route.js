const express = require('express');

const router = express.Router();
const adminController = require('../../controllers/admin.controller');
const adminCheckAuth = require('../../middlewares/adminCheckAuth')
const uploadImage = require('../../middlewares/multerUploadImage')
const uploadVideo = require('../../middlewares/multerUploadVideo')
const setFolderName = require('../../middlewares/setFolderName')

router.use('/', express.static('public'));
router.post('/login', adminController.admin_login)
router.get('/logout', adminController.admin_logout)
router.get('/newCourse', adminCheckAuth, adminController.get_newCourse_page)
router.post('/newCourse', adminCheckAuth, uploadImage.single('img'), adminController.create_newCourse)
router.get('/addContent', adminCheckAuth, adminController.get_addContent_page);
router.post('/create_newCourse', adminController.create_newCourse)
router.get('/uploadVideo/:courseID', adminCheckAuth, adminController.get_uploadVideo_page)
router.post('/uploadVideo/:courseID', adminCheckAuth, setFolderName, uploadVideo, adminController.create_uploadVideo)

module.exports = router;