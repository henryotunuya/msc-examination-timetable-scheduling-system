var express = require('express');
var router = express.Router();
var exceljs = require('exceljs/modern.nodejs');
var workbook = new exceljs.Workbook();
var MYSQLDB = require('MYSQLDB');

var studentclass;
var session;
var file;
var database = new MYSQLDB();

router.post('/student', function (req, res, next) {
    var programID = req.body.studentprogram;
    var file = req.file;
    var filepath = '.\\' + file.path;
    workbook.csv.readFile(filepath)
        .then(function () {
            var worksheet = workbook.getWorksheet(1);
            flag = true;
            var counter = 0;
            var duplicateRecords = [];
            var rowCount = worksheet.rowCount;
            var actualCount = rowCount - 1;
            var isSame = false; // This will be 'true' iff the list being uploaded contains records already in db
            console.log(rowCount);
            worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                //---------- This skips the 1st row(contains the headings) ----------
                if (flag) {
                    flag = false;
                    return;
                }
                console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                var record = [];
                for (i = 2; i < row.values.length; i++) {
                    record.push(row.values[i]);
                }
                //---- Add 'program ID' as the last item since in is last on the db table--------
                record.push(programID);
                //------------------- Ends here --------------------------
                var dbtable = 'student';
                var dbcolumns = ['matricno', 'stdFirstname', 'stdMiddlename',
                    'stdLastname', 'stdGender', 'stdYear', 'stdYearAdmitted', 'progID'];
                database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
                    var jsonresponse = { 'error': error, 'isSame': isSame, 'duplicateRecords': duplicateRecords };
                    if (error) {
                        console.log('A1111: ' + error);
                        //res.send(jsonresponse);
                        return next(error);
                    } else {
                        if (results.length > 0) {
                            //console.log(counter);
                            duplicateRecords.push(results);
                            //console.log('WELOL: ' + duplicateRecords);
                        }
                        counter++;
                        if (counter === actualCount) {
                            if (actualCount === duplicateRecords.length) {
                                jsonresponse.isSame = true;
                            }
                            res.send(jsonresponse);
                        }
                    }
                });
            });
        });
});

//----- /staff/admin/upload/course
router.post('/course', function (req, res, next) {
    var courseprogram = req.body.courseprogram;
    var courseyear = req.body.courseyear;
    var coursesemester = req.body.coursesemester;
    var file = req.file;
    var filepath = '.\\' + file.path;
    workbook.csv.readFile(filepath)
        .then(function () {
            var worksheet = workbook.getWorksheet(1);
            flag = true;
            var counter = 0;
            var duplicateRecords = [];
            var rowCount = worksheet.rowCount;
            var actualCount = rowCount - 1;
            var isSame = false; // This will be 'true' iff the list being uploaded contains records already in db
            console.log(rowCount);
            worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                //---------- This skips the 1st row(contains the headings) ----------
                if (flag) {
                    flag = false;
                    return;
                }
                console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                var record = [];
                for (i = 2; i < row.values.length; i++) {
                    if (i === 3) {
                        record.push(courseprogram);
                        //i++;
                    }
                    record.push(row.values[i]);
                    console.log(row.values[i]);
                }

                //---- Add "course semester", "course year" and "course program"
                //---- as last items since the are last in the db table
                record.push(coursesemester);
                record.push(courseyear);
                //------------------- Ends here --------------------------
                console.log(record);
                var dbtable = 'course';
                var dbcolumns = ['courseCode', 'progID', 'courseTitle', 'courseCreditunit',
                    'courseDescription', 'courseSemester', 'courseYear'];
                database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
                    var jsonresponse = { 'error': error, 'isSame': isSame, 'duplicateRecords': duplicateRecords };
                    if (error) {
                        console.log('A1111: ' + error);
                        //res.send(jsonresponse);
                        return next(error);
                    } else {
                        if (results.length > 0) {
                            console.log(results.coursecode);
                            duplicateRecords.push(results);
                            //console.log('WELOL: ' + duplicateRecords);
                        }
                        counter++;
                        if (counter === actualCount) {
                            if (actualCount === duplicateRecords.length) {
                                jsonresponse.isSame = true;
                            }
                            res.send(jsonresponse);
                        }
                    }
                });
            });
        });
});

//--- End courselist

//-------- POST TO staff/admin/upload/result --------
router.post('/result', function (req, res, next) {
    var resultcourse = req.body.resultcourse;
    var resultprogram = req.body.resultprogram;
    var coursesemester = req.body.coursesemester;
    var resultyear = req.body.resultyear;
    var file = req.file;
    var filepath = '.\\' + file.path;
    workbook.csv.readFile(filepath)
        .then(function () {
            var worksheet = workbook.getWorksheet(1);
            flag = true;
            var counter = 0;
            var duplicateRecords = [];
            var rowCount = worksheet.rowCount;
            var actualCount = rowCount - 1;
            var isSame = false; // This will be 'true' iff the list being uploaded contains records already in db
            console.log(rowCount);
            worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                //---------- This skips the 1st row(contains the headings) ------------
                if (flag) {
                    flag = false;
                    return;
                }
                console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                var record = [];
                for (i = 2; i < row.values.length; i++) { // starting from 2 because the 'first' column
                    //---------- Begins from index 2 in the 'row.value' array -------------
                    if (i === 3) {
                        record.push(resultcourse);
                    }
                    //-------------------------- Ends here -----------------------------
                    record.push(row.values[i]);
                }
                record.push(resultyear);
                record.push(resultprogram);
                record.push(coursesemester);

                console.log(record);
                var dbtable = 'exam_result';
                var dbcolumns = ['matricno', 'courseCode', 'CAScore', 'examScore',
                    'courseTotal', 'courseGrade', 'examYear', 'progID', 'courseSemester'];
                database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
                    var jsonresponse = { 'error': error, 'results': results, 'isSame': isSame, 'duplicateRecords': duplicateRecords };
                    if (error) {
                        console.log('A1111: ' + error);
                        //res.send(jsonresponse);
                        return next(error);
                    } else {
                        if (results.length > 0) {
                            //console.log(counter);
                            duplicateRecords.push(results);
                            console.log('WELOL: ' + duplicateRecords);
                        }
                        counter++;
                        if (counter === actualCount) {
                            if (actualCount === duplicateRecords.length) {
                                jsonresponse.isSame = true;
                            }
                            res.send(jsonresponse);
                        }
                    }
                });
            });
        });
});

//  -- staff/admin/upload/student/class
router.post('/student/class', function (req, res, next) {
    var _class = req.body.class;
    var shortnote = req.body.shortnote;

    var dbtable = 'class';
    var dbcolumns = ['name', 'shortnote'];
    var record = [_class, shortnote];
    database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
        var jsonresponse = { 'error': error, 'results': results };
        if (error) {
            console.log(error);
            return next(error);
        }
        res.send(jsonresponse);

    });
});
//  -- staff/admin/upload/student/subject
router.post('/student/subject', function (req, res, next) {
    var _class = req.body.class;
    var term = req.body.term;
    var subjecttitle = req.body.subject;
    var aboutsubject = req.body.aboutsubject;

    var dbtable = 'subject';
    var dbcolumns = ['name', 'class', 'term', 'aboutsubject'];
    var record = [subjecttitle, _class, term, aboutsubject];
    database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
        var jsonresponse = { 'error': error, 'results': results };
        if (error) {
            console.log(error);
            return next(error);
        }
        res.send(jsonresponse);

    });
});

//  -- staff/admin/upload/college
router.post('/college', function (req, res, next) {
    var collegename = req.body.collegename;
    var collegeabbr = req.body.collegeabbr;

    var dbtable = 'college';
    var dbcolumns = ['collegeID', 'collegeName'];
    var record = [collegeabbr, collegename];
    database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
        var jsonresponse = { 'error': error, 'results': results };
        if (error) {
            console.log(error);
            return next(error);
        }
        res.send(jsonresponse);
    });
});
//  -- END  staff/admin/upload/college

//  -- staff/admin/upload/department
router.post('/department', function (req, res, next) {
    var departmentname = req.body.departmentname;
    var departmentabbr = req.body.departmentabbr;
    var departmentcollege = req.body.departmentcollege;

    var dbtable = 'department';
    var dbcolumns = ['deptID', 'deptName', 'collegeID'];
    var record = [departmentabbr, departmentname, departmentcollege];
    database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
        var jsonresponse = { 'error': error, 'results': results };
        if (error) {
            console.log(error);
            return next(error);
        }
        res.send(jsonresponse);
    });
});
//  -- END  staff/admin/upload/department

//  -- staff/admin/upload/program
router.post('/program', function (req, res, next) {
    var programname = req.body.programname;
    var programabbr = req.body.programabbr;
    var programdepartment = req.body.programdepartment;

    var dbtable = 'program';
    var dbcolumns = ['progID', 'progName', 'deptID'];
    var record = [programabbr, programname, programdepartment];
    database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
        var jsonresponse = { 'error': error, 'results': results };
        if (error) {
            console.log(error);
            return next(error);
        }
        res.send(jsonresponse);
    });
});
//  -- END  staff/admin/upload/program

//  -- staff/admin/upload/examhall
router.post('/examhall', function (req, res, next) {
    var hallname = req.body.hallname;
    var hallabbr = req.body.hallabbr;
    var hallcollege = req.body.hallcollege;
    var halllocation = req.body.halllocation;
    var hallcapacity = req.body.hallcapacity;

    var dbtable = 'exam_hall';
    var dbcolumns = ['hallID', 'hallName', 'hallLocation', 'hallCapacity', 'collegeID'];
    var record = [hallabbr, hallname, halllocation, hallcapacity, hallcollege];
    database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
        var jsonresponse = { 'error': error, 'results': results };
        if (error) {
            console.log(error);
            return next(error);
        }
        res.send(jsonresponse);
    });
});
//  -- END  staff/admin/upload/examhall

//--- /staff/admin/upload/registercourse
router.post('/registercourse', function (req, res, next) {
    var coursecode = req.body.coursecode;
    var matricno = req.body.matricno;
    var coursecreditunit = req.body.coursecreditunit;
    var studentyear = req.body.studentyear;
    var courseyear = req.body.courseyear;
    var studentprogram = req.body.studentprogram;

    var dbtable = 'course_registry';
    var dbcolumns = ['matricno', 'coursecode', 'courseCreditunit', 'courseYear', 'studentYear', 'studentProgID'];
    var record = [matricno, coursecode, coursecreditunit, courseyear, studentyear, studentprogram];
    database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
        var jsonresponse = { 'error': error, 'results': results, 'coursecreditunit': coursecreditunit };
        if (error) {
            console.log(error);
            return next(error);
        }
        res.send(jsonresponse);
    });
});
//  -- END  /staff/admin/upload/registercourse

//--- /staff/admin/upload/unregistercourse
router.post('/unregistercourse', function (req, res, next) {
    var coursecode = req.body.coursecode_un;
    var matricno = req.body.matricno_un;
    var coursecreditunit = req.body.coursecreditunit_un;

    var dbtable = 'course_registry';
    var dbcolumns = ['matricno', 'coursecode'];
    var record = [matricno, coursecode];
    database.deleteRecord(dbtable, dbcolumns, record, function (error, results, fields) {
        var jsonresponse = { 'error': error, 'results': results, 'coursecreditunit': coursecreditunit };
        if (error) {
            console.log(error);
            return next(error);
        }
        res.send(jsonresponse);
    });
});
// --- END  /staff/admin/upload/unregistercourse

//--- /staff/admin/upload/setcreditunit
router.post('/setcreditunit', function (req, res, next) {
    var creditunitlimit = req.body.creditunitlimit;

    var dbtable = 'creditunitlimit';
    database.deleteAllRecord(dbtable, function (error, results, fields) {

        var dbcolumns = ['creditunit'];
        var record = [creditunitlimit];
        database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
            var jsonresponse = { 'error': error, 'results': results };
            if (error) {
                console.log(error);
                return next(error);
            }
            res.send(jsonresponse);
        });
    });
});
//  -- END  /staff/admin/upload/setcreditunit

//--- /staff/admin/upload/setsemester
router.post('/setsemester', function (req, res, next) {
    var presentsemester = req.body.presentsemester;

    var dbtable = 'present_semester';
    database.deleteAllRecord(dbtable, function (error, results, fields) {

        var dbcolumns = ['semester'];
        var record = [presentsemester];
        database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
            var jsonresponse = { 'error': error, 'results': results };
            if (error) {
                console.log(error);
                return next(error);
            }
            res.send(jsonresponse);
        });
    });
});
//  -- END  /staff/admin/upload/setsemester

//--- /staff/admin/upload/setconstraints
router.post('/setconstraints', function (req, res, next) {
    //console.log(3);
    var ctdate = req.body.coursetodate;
    var cttime = req.body.coursetotime;
    var excludeprogramme = req.body.excludeprogramme;
    console.log(ctdate + ' ::: ' + cttime);
    var aspctdconstraint = "";
    var aspcttconstraint = "";
    var aspexpconstraint = "";

    if (ctdate != "") {
        ctdate = ctdate.split('\r\n');
        ctdate.forEach((el, i) => {
            var arr = ctdate[i].split(',');
            aspctdconstraint += `:- not scheduled("${arr[0].trim()}", "${arr[1].trim()}", _, _).`
        });
    }
    if (cttime != "") {
        cttime = cttime.split('\r\n');
        cttime.forEach((el, i) => {
            var arr = cttime[i].split(',');
            aspcttconstraint += `:- not scheduled("${arr[0].trim()}", _,"${arr[1].trim()}", _).`
        });
    }

    if (excludeprogramme != "") {
        excludeprogramme = excludeprogramme.split('\r\n');
        excludeprogramme.forEach((el, i) => {
            var arr = excludeprogramme[i].split(',');
            aspexpconstraint += `:- scheduled(C, D, T, _), course(C', P, Y,_ ,_), C = C', P = "${arr[0].trim()}", Y = "${arr[1].trim()}", D = "${arr[2].trim()}", T = "${arr[3].trim()}".`
        });
    }

    console.log(aspctdconstraint);
    console.log(aspcttconstraint);
    console.log(aspexpconstraint);

    var values = [];

    var dbtable = 'constraints';
    var dbcolumns = [];

    database.deleteRecord(dbtable, dbcolumns, values, function (error, results, fields) {
        var dbcolumns = ['course_to_date', 'course_to_time', 'excludeprogramme'];
        var record = [aspctdconstraint, aspcttconstraint, aspexpconstraint];
        console.log('Escape!');
        database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
            var jsonresponse = { 'error': error, 'results': results };
            if (error) {
                console.log(error);
                return next(error);
            }
            res.send(jsonresponse);
        });
    });
});
//  -- END  /staff/admin/upload/setconstraints

//--- /staff/admin/upload/setexamdateandtime
router.post('/setexamdateandtime', function (req, res, next) {
    var examdates = req.body.examdates;
    var examdurations = req.body.examdurations;
    examdates = examdates.split('\r\n');
    examdates.forEach((el, i) => { examdates[i] = `"${el}"` });
    var examdatesInASP = examdates.join(';');

    examdurations = examdurations.split('\r\n');
    examdurations.forEach((el, i) => { examdurations[i] = `"${el}"` });
    var examdurationsInASP = examdurations.join(';')

    var dbtable = 'examdate_and_duration';
    var dbcolumns = ['dates', 'durations'];
    var record = [examdatesInASP, examdurationsInASP];

    database.deleteAllRecord(dbtable, function (error, results, fields) {
        database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
            var jsonresponse = { 'error': error, 'results': results };
            if (error) {
                console.log(error);
                return next(error);
            }
            res.send(jsonresponse);
        });
    });
});
//  -- END  /staff/admin/upload/setexamdateandtime

/*
//--- /staff/admin/upload/setexamduration
router.post('/setexamduration', function (req, res, next) {
    var examdurations = req.body.examdurations;

    examdurations = examdurations.split('\r\n');
    examdurations.forEach((el, i) => { examdurations[i] = `"${el}"` });
    var examdurationsInASP = examdurations.join(';')
    //console.log(examdurations);

    var dbtable = 'examdate_and_duration';
    var dbcolumns = ['durations'];
    var record = [examdurationsInASP];

    database.deleteAllRecord(dbtable, function (error, results, fields) {
        database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
            var jsonresponse = { 'error': error, 'results': results };
            if (error) {
                console.log(error);
                return next(error);
            }
            res.send(jsonresponse);
        });
    });
});
//  -- END  /staff/admin/upload/setexamduration
*/



module.exports = router;