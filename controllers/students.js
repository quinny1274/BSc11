const studentModel = require('../models/students');

exports.create = function (userData, filePath) {
    let student = new studentModel({
        first_name: userData.first_name,
        last_name: userData.last_name,
        dob: userData.dob,
        img: filePath,
    });

    return student.save().then(student => {
        console.log(student);

        return JSON.stringify(student);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getAll = function () {
    return studentModel.find({}).then(students => {
        return JSON.stringify(students);
    }).catch(err => {
        console.log(err);

        return null;
    });
};