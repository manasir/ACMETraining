// api router
var express = require('express');
var router = express.Router();
var mainController = require('../controllers/mainController');

router.get('/courses', mainController.listCourses);
router.get('/courses/:courseId', mainController.getCourseById);
router.post('/courses', mainController.createCourse);
router.put('/courses/:courseId', mainController.updateCourse);
router.delete('/courses/:courseId', mainController.deleteCourse);

router.get('/courses/:courseId/classes', mainController.listClasses);
router.get('/courses/:courseId/classes/:classId', mainController.getClassById);
router.post('/courses/:courseId/classes/', mainController.createClass);
router.put('/courses/:courseId/classes/:classId', mainController.updateClass);
router.delete('/courses/:courseId/classes/:classId', mainController.deleteClass);


module.exports = router;