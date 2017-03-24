var express = require('express');
var router = express.Router();
var frontController = require('../controllers/frontController');
var PropertiesReader = require('properties-reader');
var path = PropertiesReader('../Acmetraining/app_server/paths.properties');

router.get('/', frontController.index);
router.get('/about', frontController.about);
var getCoursesPath = path.get('front.courses');
console.log("index.js coursesPath " + getCoursesPath);
router.get(getCoursesPath, frontController.courses);

module.exports = router;
