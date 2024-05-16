var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

// Route to handle form submission
// router.post('/submit', (req, res) => {
//   const {username} = req.body;
//   if (username) {
//     // Retrieve form data using document.getElementById
//     console.log(username);
//
//     res.redirect('explore');
//     console.log(username)
//   }
//   else {
//     res.status(400).send('Username is required')
//   }
//
// });


module.exports = router;
