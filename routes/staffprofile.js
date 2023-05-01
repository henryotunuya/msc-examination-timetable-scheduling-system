var express = require('express');
var router = express.Router();
var username;
var MYSQLDB = require('MYSQLDB');
var database = new MYSQLDB();

router.post('/', function (req, res, next) {
    session = req.session;
    session.username = username = req.body.username;
    if (username) {
        res.render('staffprofile', {title: 'Staff Profile'});
    } else
    {
        res.redirect('/staff/login');
    }
});

router.get('/', function(req, res, next) {
    session = req.session;
    username = session.username;
    if (username) {
        res.render('staffprofile', {title: 'Staff Profile'});
    } else
        res.redirect('/staff/login');
});

router.post('/viewuploadedresults', function(req, res, next) {
    var class_vur = req.body.class_vur;
    var term_vur = req.body.term_vur;
    var session_vur = req.body.session_vur; 
    var output = "";   
    values = [];
    values.push(class_vur);
    values.push(term_vur);
    values.push(session_vur);
    console.log(values);
    var dbtable = 'result';
    var dbcolumns = ['class', 'term', 'year'];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                output += `<tr class = 'trow'> <td> ${i + 1} </td>
                <td>${results[i].subjectname}</td>
                <td>${results[i].class}</td>
                <td>${results[i].term}</td>
                <td>${results[i].year}</td>
                <td>${results[i].dateuploaded.toDateString()}</td>
                <td><form method='GET' action='editdata/student' target='_blank' id='formeditstudent'> 
                <input type='hidden' name='resultid' value='${results[i].resultid}'>  
                <button> Delete </button>
                </form></td>`;
                console.log(output);
            }
            var jsonresult = { 'rowsInserted': results.length, 'output': output };
            res.send(jsonresult);
            output = '';
        } else {
            res.send('false');
        }
    });

});

module.exports = router;
