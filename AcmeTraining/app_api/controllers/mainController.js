var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('../Acmetraining/app_api/db.properties');

var mongoose = require('mongoose');
var course = mongoose.model('courseSchema');

module.exports.listCourses = function (req, res) {
    e
    console.log("list Courses");
    course
        .find({ name: { $exists: true } })
        .select('-classes -preReqs -subCourses')   // course only
        .exec(function (err, courses) {
            if (err) {
                sendJsonResponse(res, 404, err);
            }
            else {
                sendJsonResponse(res, 200, courses);
            }
        });
};

module.exports.getCourseById = function (req, res) {
    if (req.params && req.params.courseId) {
        course
            .findById(req.params.courseId)
            .exec(function (err, course) {
                if (!course) {
                    sendJsonResponse(res, 404, properties.get('jsonErrMsg.courseNotFound'));
                }
                else if (err) {
                    sendJsonResponse(res, 404, err);
                }
                sendJsonResponse(res, 200, course);
            });
    }
    else {
        sendJsonResponse(res, 404, properties.get('jsonErrMsg.reqParamMissing'));
    }
};

module.exports.createCourse = function (req, res) {
    course.create(
        {
            name: req.body.name,
            description: req.body.description,
            subCourses: req.body.subCourses,
            preReqs: req.body.preReqs,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            classes: req.body.classes
        },
        function (err, newCourse) {
            if (err) {
                sendJsonResponse(res, 400, err);
            }
            else {
                sendJsonResponse(res, 201, newCourse);
            }
        }
    );
};

module.exports.updateCourse = function (req, res) {
    if (req.params && req.params.courseId) {
        course
            .findById(req.params.courseId, function (err, theCourse) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                }
                else {
                    theCourse.name = req.body.name;
                    theCourse.description = req.body.description;
                    theCourse.fromDate = req.body.description.fromDate;
                    theCourse.toDate = req.body.description.toDate;

                    theCourse.save(function (err, updatedCourse) {
                        if (err) {
                            sendJsonResponse(res, 406, err);
                        }
                        else {
                            sendJsonResponse(res, 202, updatedCourse);
                        }
                    });
                }
            });
    }
    else {
        sendJsonResponse(res, 404, properties.get('jsonErrMsg.reqParamMissing'));
    }
};

module.exports.deleteCourse = function (req, res) {
    if (req.params && req.params.courseId) {
        course
            .findByIdAndRemove(req.params.courseId)
            .exec(function (err, course) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                }
                else {
                    sendJsonResponse(res, 204, null);
                }
            });
    }
    else {
        sendJsonResponse(res, 404, properties.get('jsonErrMsg.reqParamMissing'));
    }
};

module.exports.listClasses = function (req, res) {
    if (req.params && req.params.courseId) {
        course
            .findById(req.params.courseId)
            .select('classes')
            .exec(function (err, theCourse) {
                if (!theCourse) {
                    sendJsonResponse(res, 404, properties.get('jsonErrMsg.courseNotFound'));
                }
                else if (err) {
                    sendJsonResponse(res, 404, err);
                }
                else {
                    sendJsonResponse(res, 200, theCourse);
                }
            });
    }
    else {
        sendJsonResponse(res, 404, properties.get('jsonErrMsg.reqParamMissing'));
    }
};

module.exports.getClassById = function (req, res) {
    if (req.params && req.params.courseId && req.params.classId) {
        course
            .findById(req.params.courseId)
            .select('classes')
            .exec(function (err, theCourse) {
                if (!theCourse) {
                    sendJsonResponse(res, 404, properties.get('jsonErrMsg.classNotFound'));
                }
                else if (err) {
                    sendJsonResponse(res, 404, err);
                }
                else {
                    var theClass = theCourse.classes.id(req.params.classId);
                    sendJsonResponse(res, 200, theClass);
                }
            });
    }
    else {
        sendJsonResponse(res, 404, properties.get('jsonErrMsg.reqParamMissing'));
    }
};

module.exports.createClass = function (req, res) {
    if (req.params && req.params.courseId) {
        course
            .findById(req.params.courseId)
            .select('classes')
            .exec(function (err, theCourse) {
                if (!theCourse) {
                    sendJsonResponse(res, 404, properties.get('jsonErrMsg.courseNotFound'));
                }
                else if (err) {
                    sendJsonResponse(res, 404, err);
                }
                addClass(req, res, theCourse);
            });
    }
    else {
        sendJsonResponse(res, 404, properties.get('jsonErrMsg.reqParamMissing'));
    }
};

module.exports.updateClass = function (req, res) {
    if (req.params && req.params.courseId && req.params.classId) {
        course
            .findById(req.params.courseId)
            .select('classes')
            .exec(function (err, theCourse) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                }
                else {
                    theClass = theCourse.classes.id(req.params.classId);
                    if (!theClass) {
                        sendJsonResponse(res, 404, properties.get('jsonErrMsg.classNotFound'));
                    }
                    else {
                        theClass.location = req.body.location;
                        theClass.description = req.body.description;
                        theClass.fromDate = req.body.fromDate;
                        theClass.toDate = req.body.toDate;

                        theCourse.save(function (err, updatedCourse) {
                            if (err) {
                                sendJsonResponse(res, 406, err);
                            }
                            else {
                                sendJsonResponse(res, 202, updatedCourse.classes.id(theClass.id));
                            }
                        });
                    }
                }
            });
    }
    else {
        sendJsonResponse(res, 404, properties.get('jsonErrMsg.reqParamMissing'));
    }
};

module.exports.deleteClass = function (req, res) {
    if (req.params && req.params.courseId && req.params.classId) {
        course
            .findById(req.params.courseId)
            .select('classes')
            .exec(function (err, theCourse) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                }
                else {
                    theCourse.classes.id(req.params.classId).remove();
                    theCourse.save(function (err, updatedCourse) {
                        if (err) {
                            sendJsonResponse(res, 404, err);
                        }
                        else {
                            sendJsonResponse(res, 202, null);
                        }
                    });
                }
            });
    }
    else {
        sendJsonResponse(res, 404, properties.get('jsonErrMsg.reqParamMissing'));
    }
};

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

function addClass(req, res, theCourse) {
    theCourse.classes.push({
        location: req.body.location,
        description: req.body.description,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
    });

    // save the course with the new class
    theCourse.save(function (err, thisCourse) {
        var newClass;
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            newClass = thisCourse.classes[thisCourse.classes.length - 1]; // newly added class is at the end of the array
            sendJsonResponse(res, 201, newClass);
        }
    });
}