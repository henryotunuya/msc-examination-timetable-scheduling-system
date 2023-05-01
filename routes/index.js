var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect("/staff/login");
    //res.render('admin', { title: 'Home' });
});

module.exports = router;
