var express = require('express');
var router = express.Router();
var session;
/* GET login page. */
router.get('/student/login', function (req, res, next) {
  /*  username = req.session.username;
    if (username) {
        //req.session.logout = false;
        res.redirect('/student/profile');
    } else
    { */
        res.render('login', {title: 'Login', heading: 'Student login', 
            info: 'Please log-in with your correct details.', action: 'profile'});
    //}
});

router.post('/student/login', function (req, res, next) {
    username = req.session.username;
    if (username) {
        res.redirect('/student/profile');
    } else
    {
        res.render('login', {title: 'Login', heading: 'Student login', 
            info: 'Please log-in with your correct details.', action: 'profile'});
   }
});
router.get('/staff/login', function (req, res, next) {
    session = req.session;
    username = session.username;
    if (username) {
        res.redirect('/staff/admin');
    } else
    {
        res.render('login', {title: 'Admin login', heading: 'Admin login', 
            info: 'Please log-in with your correct details.', action: 'admin'});
    }
});
module.exports = router;
