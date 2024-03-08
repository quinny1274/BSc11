var express = require('express');
var router = express.Router();
var students = require('../controllers/students')
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/uploads');
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    filename = Date.now() + '.' + file_extension[file_extension.length-1];
    cb(null, filename);
  }
});
let upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/add', upload.single('myImg'), function(req, res, next) {
  let userData = req.body;
  let filePath = req.file.path;
  let result = students.create(userData, filePath);
  console.log(result);
  res.redirect('/');
});

router.get('/display', function(req, res, next) {
  let result = students.getAll()
  result.then(students => {
    let data = JSON.parse(students);
    res.render('display', {title: 'View All Students', data: data});
  })
});

module.exports = router;
