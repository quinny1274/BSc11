var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

// Route to handle form submission
router.post('/submit', (req, res) => {
  const {username} = req.body;
  if (username) {
    res.cookie('username', username)
    res.redirect('explore');
    var cookie = getCookie(req)
    console.log(cookie)
  }
  else {
    res.status(400).send('Username is required')
  }

});

// Gets the Cookie for Username for testing.
function getCookie(req) {
  var cookie = req.headers.cookie;
  return cookie.split('; ');
}

module.exports = router;
