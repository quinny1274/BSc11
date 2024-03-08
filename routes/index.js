var express = require('express');
var router = express.Router();
var students = require('../controllers/students')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/explore', function(req, res, next) {
  res.render('explore', { title: 'Explore' });
});

router.get('/display', function(req, res, next) {
  let result = students.getAll()
  result.then(students => {
    let data = JSON.parse(students);
    res.render('display', {title: 'View All Students', data: data});
  })
});

module.exports = router;
