var express = require('express');
var router = express.Router();
var MYSQLDB = require('MYSQLDB');
var username = '';
var database = new MYSQLDB();

router.post('/', function (req, res, next) {
    username = req.body.username;
    var values = [];
    values.push(username);

    var dbtable = 'student';
    var dbcolumns = ['matricno'];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            req.session.username = username;
            req.session.studentyear = results[0].stdYear;
            req.session.studentprogram = results[0].progID;
            console.log(username);
            res.render('studentprofile', { title: 'Student Profile', username: username });
        } else {
            res.render('login', {
                title: 'Login', heading: 'Student login',
                info: 'Please log-in with your correct details.', action: 'profile',
                errormsg: 'Invalid username!'
            });
        }
    });
});

router.get('/', function (req, res, next) {
    //username ;
    console.log(`router.get - ${username}`);
    console.log(username);
    console.log(req.session.username);
  //  if (username != '' & username == req.session.username) {
   //     res.render('studentprofile', { title: 'Student Profile', username: username });
    //}
    if(username !== req.session.username)
        res.redirect('/student/login');
});

router.post('/examtimetable', function (req, res, next) {
    var dbtable = 'approvedexamtimetable';
    var dbcolumns = [];
    var values = [];
    var htmltimetable='';
console.log('1');
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, result, fields) {
        if (result.length > 0) {
            for (let r in result) {
                    htmltimetable = result[r].htmltimetable;}
        }
        console.log(htmltimetable);
        if(htmltimetable==''){
            htmltimetable =`<h3>Timetable not available!</h3>`;
        }
        res.send(`<!DOCTYPE html><html><head><title>
        Exam Timetable - Examination Timetabling System</title>
        <link rel="stylesheet" type="text/css" href="/stylesheets/studentprofileStyle.css">
        <link rel="stylesheet" type="text/css" href="/stylesheets/adminStyle.css">
        <link rel="icon" type="image/png" href="/images/favicon.png">
        <link rel="stylesheet" type="text/css" href="/stylesheets/style.css"></head><body>
        <h2 class="heading lg"> Examination timetable </h2>
        ${htmltimetable}
        </body>
        </html>
        `);
    });
});

module.exports = router;