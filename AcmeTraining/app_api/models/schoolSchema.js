console.log("schoolSchema.js starts here");
var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    username: String,
    password: String
});

var dayTimeLocationSchema = new mongoose.Schema({
    day: Date,
    startTime: Date,
    endTime: Date,
    location: String,
    teacher: String,
    description: String
});

var classSchema = new mongoose.Schema({
    location: String,
    description: String,
    createdOn: {
        type: Date,
        "default": Date.now
    },
    fromDate: {
        type: Date,
        "default": Date.now
    },
    toDate: {
        type: Date,
        "default": Date.now
    },
    dtls: [dayTimeLocationSchema]
});

var courseSchema = new mongoose.Schema({
    name: String,
    description: String,
    subCourses: [String],
    preReqs: [String],
    createdOn: {
        type: Date,
        "default": Date.now
    },
    fromDate: {
        type: Date,
        "default": Date.now
    },
    toDate: {
        type: Date,
        "default": Date.now
    },
    classes: [classSchema]
});


mongoose.model('courseSchema', courseSchema);
