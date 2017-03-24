var PropertiesReader = require('properties-reader');
//TODO: make this part dynamic by looking into user-agent language
var properties = PropertiesReader('../Acmetraining/app_server/en_labels.properties');
var paths = PropertiesReader('../Acmetraining/app_server/paths.properties');

var request = require('request');

module.exports.index = function (req, res) {

    var title = properties.get('main.app.name');
    var learnMore = properties.get('app.learn.more');
    var description = properties.get('main.app.description');
    var student = properties.get('main.app.student');
    var teacher = properties.get('main.app.teacher');
    var admin = properties.get('main.app.admin');

    var admin_description = properties.get('main.app.admin.description');
    var student_description = properties.get('main.app.student.description');
    var teacher_description = properties.get('main.app.teacher.description');

    res.render('index', {
        title: title,
        learnMore: learnMore,
        year: new Date().getFullYear(),
        description: description,
        student: student,
        student_description: student_description,
        teacher: teacher,
        teacher_description: teacher_description,
        admin: admin,
        admin_description: admin_description
    });
};

module.exports.about = function (req, res) {
    var title = properties.get('main.app.name');
    var description = properties.get('main.app.description');
    res.render('about', {
        title: title,
        description: description
    });
};

module.exports.courses = function (req, res) {
    console.log("frontend conroller + courses");
    if (req.params.courseId) {
        courseDetail(req, res);
    }
    else {
        var title = properties.get('main.app.name');
        var learnMore = properties.get('app.learn.more');
        var description = properties.get('main.app.description');
        var coursesHeading = properties.get('main.courses.title');
        var courseDetailPath = paths.get('front.courses');
        var requestOptions = {
            url: paths.get('back.courses'),
            method: 'GET',
            json: {},
            qs: {}
        };

        request(requestOptions, function (err, response, body) {
            if (err) {
                renderErrorPage(req, res, err, response, body);
            }
            else if (response.statusCode === 200) {
                res.render('courses', {
                    title: title,
                    learnMore: learnMore,
                    year: new Date().getFullYear(),
                    description: description,
                    coursesHeading: coursesHeading,
                    //courseDetail: courseDetailPath,
                    //courses: body
                });
            }
            else {
                console.log(response);
            }
        });
    }
};

function courseDetail(req, res) {
    console.log("courseDetail function called");
}

function renderErrorPage(req, res, err, response, body) {
    res.render('error', {
        error: err,
        statusCode: response.statusCode,
        message: body
    }
    );
}