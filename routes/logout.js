var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/student/logout', function (req, res, next) {
    req.session.destroy(function(error){
        //req.session.logout = true;
        res.redirect('/student/login');
    });
});
router.get('/staff/logout', function (req, res, next) {
    req.session.destroy(function(error){
        //req.session.logout = true;
        res.redirect('/staff/login');
    });
});
router.get('/parent/logout', function (req, res, next) {
    req.session.destroy(function(error){
        //req.session.logout = true;
        res.redirect('/parent/login');
    });
});
module.exports = router;
