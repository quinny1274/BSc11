var express = require('express');
const plants = require("../controllers/plants");
const multer = require("multer");
var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads');
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    filename = Date.now() + '.' + file_extension[file_extension.length - 1];
    cb(null, filename);
  }
});
let upload = multer({storage: storage});

router.get('/', function (req, res, next) {
  res.render('create', {title: 'Create'});
});

router.post('/add', upload.single('img'), function (req, res, next) {
  let userData = req.body;
  let filePath = req.file.path;
  let nickname = userData.userID;
  plants.create(userData, filePath, nickname).then(plant => {
    console.log(plant);
    res.status(200).send(plant);
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

module.exports = router;
