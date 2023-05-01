const express = require('express');
const router = express.Router();
const MYSQLDB = require('MYSQLDB');
const clingo = require("clingo-wasm");
var data = '';

var studentclass;
var session;
var output = "";
var database = new MYSQLDB();

// Student
router.post('/student', function (req, res, next) {
    var studentprogram = req.body.studentprogram;
    var studentyear = req.body.studentyear;
    var studentyearadmitted = req.body.studentyearadmitted;
    var values = [];
    values.push(studentprogram);
    values.push(studentyear);
    values.push(studentyearadmitted);
    console.log(values);
    var dbtable = 'student';
    var dbcolumns = ['progID', 'stdYear', 'stdYearAdmitted'];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                output += `<tr class = 'trow'><td> ${i + 1} </td>
                <td>${results[i].matricno}</td> 
                <td>${results[i].stdFirstname}</td>
                <td>${results[i].stdMiddlename}</td> 
                <td>${results[i].stdLastname}</td>
                <td>${results[i].stdGender}</td>
                <td>${results[i].stdYear}</td>
                <td>${results[i].progID}</td> 
                <td>${results[i].stdYearAdmitted}</td> 
                </tr> `;
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

// Staff
router.post('/staff', function (req, res, next) {
    staffclass = req.body.class;
    values = [];
    values.push(staffclass);
    console.log(values);
    var dbtable = 'staff';
    var dbcolumns = ['classheading'];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                output += `<tr class = 'trow'> <td> ${i + 1} </td>
                <td>${results[i].staffid}</td>
                <td>${results[i].title}</td>
                <td>${results[i].firstname}</td> 
                <td>${results[i].middlename}</td>
                <td>${results[i].lastname}</td>
                <td>${results[i].gender}</td>`;
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

// Parent
router.post('/parent', function (req, res, next) {
    //parentclass = req.body.class;
    values = [];
    //values.push(staffclass);
    console.log(values);
    var dbtable = 'parent';
    var dbcolumns;
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                output += `<tr class = 'trow'> <td> ${i + 1} </td>
                <td>${results[i].parentid}</td>
                <td>${results[i].title}</td>
                <td>${results[i].firstname}</td> 
                <td>${results[i].middlename}</td>
                <td>${results[i].lastname}</td>
                <td>${results[i].gender}</td>
                <td>${results[i].relationship}</td>`;
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
// College
router.post('/college', function (req, res, next) {
    var values = [];
    console.log(values);
    var dbtable = 'college';
    var dbcolumns = [];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                output += `<tr class = 'trow'> <td> ${i + 1} </td>
                <td>${results[i].collegeID}</td>
                <td>${results[i].collegeName}</td>`;
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

// Department
router.post('/department', function (req, res, next) {
    departmentcollege = req.body.departmentcollege;
    var values = [];
    values.push(departmentcollege);
    console.log(values);
    var dbtable = 'department';
    var dbcolumns = ["collegeID"];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                output += `<tr class = 'trow'> <td> ${i + 1} </td>
                <td>${results[i].deptID}</td>
                <td>${results[i].deptName}</td>
                <td>${results[i].collegeID}</td>`;
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

// Program
router.post('/program', function (req, res, next) {
    var programdepartment = req.body.programdepartment;
    var values = [];
    values.push(programdepartment);
    console.log(values);
    var dbtable = 'program';
    var dbcolumns = ["deptID"];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                output += `<tr class = 'trow'> <td> ${i + 1} </td>
                <td>${results[i].progID}</td>
                <td>${results[i].progName}</td>
                <td>${results[i].deptID}</td>`;
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

// Course
router.post('/course', function (req, res, next) {
    var courseprogram = req.body.courseprogram;
    var courseyear = req.body.courseyear;
    var values = [];
    values.push(courseprogram);
    values.push(courseyear);
    console.log(values);
    var dbtable = 'course';
    var dbcolumns = ['progID', 'courseYear'];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                output += `<tr class = 'trow'> <td> ${i + 1} </td>
                <td>${results[i].courseCode}</td>
                <td>${results[i].courseTitle}</td>
                <td>${results[i].courseCreditunit}</td>
                <td>${results[i].courseSemester}</td>
                <td>${results[i].courseYear}</td>
                <td>${results[i].progID}</td>`;
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

// Result
router.post('/result', function (req, res, next) {
    var resultdepartment = req.body.resultdepartment;
    var resultyear = req.body.resultyear;
    var resultsemester = req.body.resultsemester;
    var values = [];
    values.push(resultdepartment);
    values.push(resultyear);
    values.push(resultsemester);
    console.log(values);
    var dbtable = 'exam_result';
    var dbcolumns = ['CAScore', 'examScore', 'courseGrade', 'dateInserted', 'courseTotal',
        'examYear', 'courseCode', 'matricno'];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                output += `<tr class = 'trow'> <td> ${i + 1} </td>
                <td>${results[i].matricno}</td>
                <td>${results[i].courseCode}</td>
                <td>${results[i].CAScore}</td>
                <td>${results[i].examScore}</td>
                <td>${results[i].courseGrade}</td>
                <td>${results[i].courseTotal}</td>`;
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

// Exam hall
router.post('/examhall', function (req, res, next) {
    var hallcollege = req.body.hallcollege;
    var values = [];
    values.push(hallcollege);
    console.log(values);
    var dbtable = 'exam_hall';
    var dbcolumns = ['collegeID'];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (var i in results) {
                output += `<tr class = 'trow'> <td> ${i + 1} </td>
                <td>${results[i].hallID}</td>
                <td>${results[i].hallName}</td>
                <td>${results[i].hallCapacity}</td>
                <td>${results[i].hallLocation}</td>
                <td>${results[i].collegeID}</td>`;
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

// Student course
router.post('/studentcourse', function (req, res, next) {
    var username = req.session.username;
    var studentyear_session = req.session.studentyear;
    var studentprogram_session = req.session.studentprogram;
    console.log(username);
    var values = [];
    values.push(username);
    var serialnumber = 1;
    var registeredcreditunit = 0;
    var creditunitlimit = 0;
    var countbeginning = 0;
    var firstcoursecount = 0;
    var registeredbtns = [];
    var unregisteredbtns = [];
    var progID = '';

    var allCoursecodes = [];
    console.log(values);
    var dbtables = {
        t1: 'student', t2: 'course',
        t3: 'present_semester',
        t4: 'exam_result',
        t5: 'creditunitlimit',
        t6: 'course_registry'
    };
    var dbcolumns = {
        t1c: ['matricno'],
        t2c: ['progID', 'courseYear', 'courseSemester'],
        t3c: [], t4c: ['matricno', 'courseGrade', 'courseSemester'],
        t2bc: ['courseCode', 'progID'],
        t5c: [],
        t6c: ['matricno', 'courseCode'],
        t6c_2: ['matricno', 'coursecode', 'courseCreditunit', 'courseYear', 'studentYear', 'studentProgID']
    };
    database.searchAllRecords(dbtables.t1, dbcolumns.t1c, values, function (error, results, fields) {
        var values = [];
        if (results.length > 0) {
            values.push(results[0].progID);
            progID = results[0].progID;
            values.push(results[0].stdYear);
            var novalue = undefined;
            database.searchAllRecords(dbtables.t3, dbcolumns.t3c, novalue, function (error, results, fields) {
                if (results.length > 0) {
                    values.push(results[0].semester);
                    console.log(`Semester: ${results[0].semester}`);
                    //----- Get records from exam_result table -----
                    var t4values = [];
                    t4values.push(username);
                    t4values.push('F');
                    t4values.push(results[0].semester);
                    database.searchAllRecords(dbtables.t4, dbcolumns.t4c, t4values, function (error, results, fields) {
                        if (results.length > 0) {
                            for (var i in results) {
                                //console.log(`CourseCode: ${results[i].courseCode}`);
                                var t2values = [];
                                t2values.push(results[i].courseCode);
                                t2values.push(progID);
                                database.searchAllRecords(dbtables.t2, dbcolumns.t2bc, t2values, function (error, results, fields) {
                                    if (results.length > 0) {
                                        for (i = 0; i < results.length; i++) {
                                            output += `<tr class = 'trow'> <td> ${serialnumber} </td>
                                            <td>${results[i].courseCode}</td>
                                            <td>${results[i].courseTitle}</td>
                                            <td>${results[i].courseCreditunit}</td>
                                            <td>${results[i].courseSemester}</td>
                                            <td>${results[i].courseYear}</td>
                                            <td>
                                            <form method='POST' id='formunregisterpercourse_${serialnumber}'> 
                                            <input type='hidden' name='coursecode_un' value='${results[i].courseCode}'>                
                                            <input type='hidden' name='coursecreditunit_un' value='${results[i].courseCreditunit}'>
                                            <input type='hidden' name='matricno_un' value='${username}'>
                                            <button type='submit' id='unregistercoursebtn_${serialnumber}' disabled > Registered already </button>
                                            </form>
                                            </td>`;
                                            //####  Begins - Send registered course into the database

                                            // database.insertRecord(dbtables.t6, dbcolumns.t6c, {});
                                            var record = [username, results[i].courseCode, results[i].courseCreditunit, results[i].courseYear, studentyear_session, studentprogram_session];
                                            database.insertRecord(dbtables.t6, dbcolumns.t6c_2, record, function (error, results, fields) {
                                            });//####  Ends - Send registered course into the database

                                            registeredcreditunit += results[i].courseCreditunit;
                                            serialnumber++;
                                            countbeginning = serialnumber;
                                            //     console.log(output);
                                        }
                                    }
                                });
                            }
                        }
                        database.searchAllRecords(dbtables.t2, dbcolumns.t2c, values, function (error, results, fields) {
                            var ii = 0;
                            if (results.length > 0) {
                                for (ii in results) {
                                    output += `<tr class = 'trow'> <td> ${serialnumber} </td>
                                    <td>${results[ii].courseCode}</td>
                                    <td>${results[ii].courseTitle}</td>
                                    <td>${results[ii].courseCreditunit}</td>
                                    <td>${results[ii].courseSemester}</td>
                                    <td>${results[ii].courseYear}</td>
                                    <td><form method='POST' id='formregisterpercourse_${serialnumber}'> 
                                    <input type='hidden' name='coursecode' value='${results[ii].courseCode}'>
                                    <input type='hidden' name='coursecreditunit' value='${results[ii].courseCreditunit}'>
                                    <input type='hidden' name='matricno' value='${username}'>
                                    <input type='hidden' name='courseyear' value='${results[ii].courseYear}'>
                                    <input type='hidden' name='studentyear' value='${studentyear_session}'>
                                    <input type='hidden' name='studentprogram' value='${studentprogram_session}'>
                                    <button type='submit' id='registercoursebtn_${serialnumber}'  > Register </button>
                                    </form>
                                    <form method='POST' id='formunregisterpercourse_${serialnumber}'> 
                                    <input type='hidden' name='coursecode_un' value='${results[ii].courseCode}'>                
                                    <input type='hidden' name='coursecreditunit_un' value='${results[ii].courseCreditunit}'>
                                    <input type='hidden' name='matricno_un' value='${username}'>
                                    <button type='submit' id='unregistercoursebtn_${serialnumber}' > Unregister </button>
                                    </form>
                                    </td>`;
                                    allCoursecodes[serialnumber] = results[ii].courseCode;
                                    serialnumber++;
                                }
                            }
                            database.searchAllRecords(dbtables.t5, dbcolumns.t5c, values, function (error, resultst5, fields) {

                                if (resultst5.length > 0) {
                                    creditunitlimit = resultst5[0].creditunit;
                                }
                                console.log(`CU limit: ${creditunitlimit}`);
                                firstcoursecount = countbeginning;
                                console.log('CB: ' + countbeginning);
                                console.log('AC.length: ' + allCoursecodes.length);
                                for (let i = countbeginning; i < allCoursecodes.length; i++) {
                                    var course = allCoursecodes[i];
                                    var t6cvalues = [];
                                    t6cvalues.push(username);
                                    t6cvalues.push(course);
                                    //
                                    //console.log('Before db');
                                    database.searchAllRecords(dbtables.t6, dbcolumns.t6c, t6cvalues, function (error, result, fields) {
                                        //console.log('After db');
                                        if (result.length > 0) {
                                            registeredcreditunit += result[0].courseCreditunit;
                                            console.log('courseCreditunit: ' + result[0].courseCreditunit);
                                            console.log('registeredcreditunit: ' + registeredcreditunit);
                                            registeredbtns[i] = true;
                                            unregisteredbtns[i] = !true;
                                        } else {
                                            unregisteredbtns[i] = !false;
                                            registeredbtns[i] = false;
                                        }
                                        countbeginning++;
                                        if (countbeginning === allCoursecodes.length) {
                                            var jsonresult = {
                                                'rowsInserted': results.length, 'output': output,
                                                'results': results, 'serialnumber': serialnumber,
                                                'registeredcreditunit': registeredcreditunit,
                                                'creditunitlimit': creditunitlimit,
                                                'firstcoursecount': firstcoursecount,
                                                'unregisteredbtns': unregisteredbtns,
                                                'registeredbtns': registeredbtns
                                            };
                                            res.send(jsonresult);
                                            output = '';
                                            countbeginning = 0;
                                            serialnumber = 0;
                                        }
                                    });
                                }
                            });
                        });
                    });
                } else {
                    res.send('false');
                    output = '';
                    countbeginning = 0;
                    serialnumber = 0;
                }
            });
        }
    });
});


// /staff/admin/querydb/studentresult
router.post('/studentresult', function (req, res, next) {
    var username = req.session.username;
    //var programdepartment = req.body.programdepartment;
    var values = [username];
    //values.push(programdepartment);
    //console.log(values);
    var dbtable = 'exam_result';
    var dbcolumns = ['matricno'];
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                output += `<tr class = 'trow'> <td> ${i + 1} </td>
                <td>${results[i].courseCode}</td>
                <td>${results[i].CAScore}</td>
                <td>${results[i].examScore}</td>
                <td>${results[i].courseTotal}</td>
                <td>${results[i].courseGrade}</td>`;
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


// Create ASP facts from DB
router.get('/createaspfacts', function (req, res, next) {
    var coursefacts = [];
    var programs = [];
    var courseyears = [];
    var aspprogram = "";
    var carryoverStudentPrograms = [];
    var COSPyears = [];
    var unknown = '!';
    var dates = [];
    //var time = ["8-10am", "10-12pm", "12-2pm", "2pm-4pm", "4pm-6pm"];
    var time = [];
    var examschedule = [[], [], [], [], [], [], [], [], [], []];

    var dbtables = {
        t1: 'course_registry',
        t2: 'course',
        t3: 'exam_hall',
        t4: 'examdate_and_duration',
        t5: 'constraints'
    };
    var dbcolumns = {
        t1c: [],
        t2c: ['courseCode'],
        t1c_2: ['courseCode'],
        t3c: ['hallName', 'hallLocation', 'hallCapacity'],
        t4c: [],
        t5c: []
    };
    var dbfields = {
        t1c: ['courseCode'],
        t2c: ['progID', 'courseYear', 'courseCode'],
        t1f_2: ['studentProgID', 'studentYear', 'courseYear', 'courseCode'],
        t3f: [],
        t4f: ['dates', 'durations'],
        t5f: ['course_to_date', 'course_to_time']
    };
    var values;
    var examdates = "";
    var examtimes = "";
    var examtimesIndex = [];
    var timefact = "time(";
    var aspconstraints = "";
    database.searchDistinctRecords(dbtables.t4, dbfields.t4f, dbcolumns.t4c, values, function (error, results, fields) {
        if (results.length > 0) {
            for (var i in results) {
                examdates = `date(${results[i].dates}).`;
                dates = results[i].dates.split(';');
                examtimes = `${results[i].durations}`;
                //examtimes = `time(${results[i].durations})`;
            }
            console.log(dates);
            dates.forEach((el, i) => { dates[i] = dates[i].substring(1, dates[i].length - 1) });
            console.log(dates);
            examtimesIndex = examtimes.split(';');
            examtimesIndex.forEach((el, i) => {
                if (i + 1 == examtimesIndex.length) {
                    timefact += `"${i + 1}").`;
                } else {
                    timefact += `"${i + 1}";`;
                }
                time.push(`${i + 1}`);

            });
        }
    });

    database.searchDistinctRecords(dbtables.t5, dbfields.t5f, dbcolumns.t5c, values, function (error, results, fields) {
        if (results.length > 0) {
            for (var i in results) {
                aspconstraints += `${results[i].course_to_date}`;
                aspconstraints += `${results[i].course_to_time}`;
            }
        }
    });



    database.searchDistinctRecords(dbtables.t1, dbfields.t1c, dbcolumns.t1c, values, function (error, results, fields) {
        if (results.length > 0) {
            for (var i in results) {
                var value = [];
                value.push(results[i].courseCode);
                coursefacts.push(
                    {
                        coursecode: results[i].courseCode,
                        programs: null,
                        courseyears: null,
                        noOfStudents: '',
                        carryoverProg: [],
                        carryoverProgYears: []
                    }
                );
            }
        } var selectcounter = -1;
        var coursecodesCounter = 0;
        // console.log(`LENGHT >>>>> ${coursefacts.length}`);
        for (var i = 0; i < coursefacts.length; i++) {
            var coursecode = coursefacts[i].coursecode;
            // console.log(`CCODE: ${coursecode}`);
            database.searchDistinctRecords(dbtables.t2, dbfields.t2c, dbcolumns.t2c, coursecode, function (error, results, fields) {

                if (results.length > 0) {
                    for (var ri in results) {
                        programs.push(results[ri].progID);
                        courseyears.push(results[ri].courseYear);

                        selectcounter++;
                        for (let i = 0; i < coursefacts.length; i++) {
                            if (coursefacts[i].coursecode == results[ri].courseCode) {
                                coursefacts[i].programs = programs;
                                coursefacts[i].courseyears = courseyears;
                            }
                        }
                    }
                }
                programs = [];
                courseyears = [];
                coursecodesCounter++;
                if (coursefacts.length == coursecodesCounter) {
                    //If the no of items in the db have been tranversed then look out
                    //for the carry-over courses (if available)
                    coursecodesCounter = 0;
                    for (var i = 0; i < coursefacts.length; i++) {
                        var coursecode = coursefacts[i].coursecode;
                        database.searchDistinctRecords(dbtables.t1, dbfields.t1f_2, dbcolumns.t1c_2, coursecode, function (error, results, fields) {
                            if (results.length > 0) {
                                for (var rco in results) {

                                    //-- Condition says: If the student is a carryover student, then...
                                    if (results[rco].studentYear > results[rco].courseYear) {
                                        //  console.log(`<<<< ProgIDCarryOVer >>>> : ${results[rco].studentProgID}`);
                                        //  console.log(`<<<< YearCarryOVer >>>> : ${results[rco].studentYear}`);
                                        carryoverStudentPrograms.push(results[rco].studentProgID);
                                        COSPyears.push(results[rco].studentYear);

                                        //programs.push(results[rco].studentProgID);
                                        var pr = (results[rco].studentProgID);
                                        var yr = results[rco].studentYear

                                        //courseyears.push(results[rco].studentYear);
                                        for (let i = 0; i < coursefacts.length; i++) {
                                            if (coursefacts[i].coursecode == results[rco].courseCode) {
                                                //coursefacts[i].carryoverProg = programs;
                                                coursefacts[i].carryoverProg.push(pr);
                                                coursefacts[i].carryoverProgYears.push(yr);
                                                programs = [];
                                                courseyears = [];
                                            }
                                        }

                                    }
                                }
                            }

                            coursecodesCounter++;
                            if (coursefacts.length == coursecodesCounter) {
                                // Get and assign to the JSON obj the number of students
                                // taking each course
                                coursecodesCounter = 0;
                                for (var i = 0; i < coursefacts.length; i++) {
                                    var coursecode = coursefacts[i].coursecode;
                                    database.searchAllRecords(dbtables.t1, ['courseCode'], coursecode, function (error, result, fields) {
                                        if (result.length > 0) {
                                            for (var r in result) {
                                                //  console.log(`Count: ${result.length}`);
                                                //  console.log(`Course code: ${result[r].courseCode}`);
                                                for (let i = 0; i < coursefacts.length; i++) {
                                                    if (coursefacts[i].coursecode == result[r].courseCode) {
                                                        coursefacts[i].noOfStudents = result.length;
                                                    }
                                                }
                                            }
                                        }
                                        coursecodesCounter++;
                                        var room = [];// [{'name':null, 'location':null, 'capacity':null}];
                                        var i = 0;
                                        if (coursefacts.length == coursecodesCounter) {
                                            database.searchAllRecords(dbtables.t3, dbfields.t3f, dbcolumns.t3c, function (error, result, fields) {
                                                if (result.length > 0) {
                                                    for (let r in result) {
                                                        room.push({
                                                            'name': result[r].hallName,
                                                            'location': result[r].hallLocation,
                                                            'capacity': result[r].hallCapacity
                                                        });
                                                        i++;
                                                        aspprogram += `room("${result[r].hallName}", "${result[r].hallLocation}", ${result[r].hallCapacity}).`
                                                    }
                                                }
                                                if (i == result.length) {
                                                    //THis code will work on the coursefacts object to
                                                    // produce our ASP facts

                                                    for (let c in coursefacts) {
                                                        var cc = `"${coursefacts[c].coursecode}"`;
                                                        var programs = '';
                                                        var noOfStudents = '';
                                                        var courseyear = '';
                                                        for (let p in coursefacts[c].programs) {
                                                            // console.log(coursefacts[c].programs);
                                                            if (p == (coursefacts[c].programs.length - 1)) {
                                                                programs += `"${coursefacts[c].programs[p]}"`;
                                                            } else {
                                                                programs += `"${coursefacts[c].programs[p]}" ; `;
                                                            }
                                                        }
                                                        courseyear = `"${coursefacts[c].courseyears[0]}"`;
                                                        noOfStudents = `${coursefacts[c].noOfStudents}`;

                                                        //A function to handle the carryover students objects
                                                        // function ripCarryoverObject() {
                                                        var coprogram = [];
                                                        var copcounter = 0;
                                                        var noting = 0;
                                                        var copindexes = [];
                                                        var notadded = true;
                                                        var program = "";
                                                        var coprogramfacts = "";
                                                        var coyears = '';
                                                        for (let cop in coursefacts[c].carryoverProg) {
                                                            // console.log(coursefacts[c].carryoverProg);
                                                            //  console.log(coursefacts[c].carryoverProg.length);

                                                            // console.log(coursefacts[c].carryoverProg);
                                                            program = coursefacts[c].carryoverProg[cop];
                                                            //  console.log('///: ' + program);
                                                            //  console.log('notadded: ' + notadded);
                                                            notadded = true;
                                                            for (let pr in coprogram) {
                                                                for (let icop in coursefacts[c].carryoverProg) {
                                                                    //console.log("Outside loop: " + coprogram[pr]);
                                                                    if (coprogram[pr] == coursefacts[c].carryoverProg[icop] & program == coprogram[pr]) {
                                                                        //console.log("In loop: " + coprogram[pr]);
                                                                        copcounter++;
                                                                        //noting++;
                                                                    }
                                                                }
                                                            }
                                                            if (copcounter > 1) {
                                                                //console.log('in counter loop: ' + notadded);
                                                                //console.log('Counter:  ' + copcounter);
                                                                notadded = false;
                                                                copcounter = 0;
                                                            }

                                                            if (notadded) {
                                                                coprogram.push(program);
                                                                //console.log("|||:  " + program);
                                                                notadded = true;
                                                                copindexes = getAllIndexes(coursefacts[c].carryoverProg, program);
                                                                for (let ci in copindexes) {
                                                                    noting++;
                                                                    if (ci == (copindexes.length - 1)) {
                                                                        coyears += `"${coursefacts[c].carryoverProgYears[copindexes[ci]]}")`;
                                                                    } else {
                                                                        coyears += `"${coursefacts[c].carryoverProgYears[copindexes[ci]]}" ; `;
                                                                    }
                                                                }
                                                                //console.log(`noting: ${noting}`);
                                                                //console.log(`cop: ${cop}`);
                                                                //console.log(`coursefacts[c].carryoverProg.length - 1: ${coursefacts[c].carryoverProg.length - 1}`);
                                                                if (noting == (coursefacts[c].carryoverProg.length)) {
                                                                    coprogramfacts += `"${program}", (${coyears}`;
                                                                    coyears = '';
                                                                } else {
                                                                    coprogramfacts += `"${program}", (${coyears} ; `;
                                                                    coyears = '';
                                                                }
                                                                //console.log(coprogramfacts);

                                                                //next, we get all the indexes with this program in the carryover student years object
                                                                function getAllIndexes(arr, val) {
                                                                    var indexes = [], i;
                                                                    for (i = 0; i < arr.length; i++) {
                                                                        if (arr[i] === val)
                                                                            indexes.push(i);
                                                                    }
                                                                    return indexes;
                                                                }
                                                                //end next...
                                                            }
                                                        }

                                                        aspprogram += `course(${cc}, (${programs}), ${courseyear}, ${noOfStudents}, (${coprogramfacts})).`;

                                                        if (c == coursefacts.length - 1) {

                                                            aspprogram += `
                                                            
${examdates}
${timefact}
${aspconstraints}

timeslot(D, T) :- date(D), time(T).
%One course one timeslot
{scheduled(C, D, T): timeslot(D, T)} = 1 :- course(C,_,_,_,_).
%One course one room
%%
%:- scheduled("CSC314", "3rd July", "5", _  ).
%%
{scheduled(C, D, T, Rname) : room (Rname,_,_)} = 1 :- scheduled(C, D, T).
%Two courses cannot be scheduled on the same timeslot and two courses cannot be scheduled in the same exam room
:- not {scheduled(C, D, T, Rname) : course(C,_,_,_,_)} 1 , room (Rname,_,_), date(D), time(T).
%Course size and room capacity
:- scheduled(C, _, _, Rname), course(C,_,_,N,_), room (Rname,_,Cap), N > Cap.
%Clashed courses
clash(C,C') :- course(C,P,Y,_,_), course(C',P',Y',_,_), P == P' , Y == Y', C != C'.
%Avoiding clashes
:- scheduled(C,D,T,_), scheduled(C',D',T',_), D == D', T == T', clash (C, C').
%Carry over clash
carryoverClash(C,C') :- course(C,_,_,_,(Pro,Yr)), course(C',_,_,_,(Pro',Yr')), C != C', Pro == Pro', Yr == Yr'.
%Avoiding carry over clashes
:- scheduled(C,D,T,_), scheduled(C',D',T',_), D == D', T == T', carryoverClash (C, C').
%Departmental courses should be taken in the college building (or designated) and not outside it. A penalty cost is %calculated when departmental courses are taken in separate [far way] buildings
%:- scheduled(C,_,_,R), course(C,P,Y,_,_,_), room(R,B,_), programToroom(P', Y', room(R,B',_)), P == P', Y == Y', B != B'. 


#show scheduled/4.
                                                            `; console.log(aspprogram);

                                                            var answerset = [];

                                                            var arrangedexams = [[], [], [], [], [], [], [], [], [], []];

                                                            clingo.run(aspprogram, 1).then(
                                                                value => {
                                                                    for (let i in value.Call[0].Witnesses) {
                                                                        answerset[i] = value.Call[0].Witnesses[i].Value;
                                                                    }

                                                                    // We now need to get the values off 'answerset' and put
                                                                    // them into an organized array for our own use.
                                                                    // 1st: strip value (i.e answerset[i][j]) off the 'scheduled' word and then the
                                                                    // last character which is the bracket
                                                                    var afact = '';
                                                                    //console.log(answerset);
                                                                    for (let i in answerset) {
                                                                        for (let j in answerset[i]) {
                                                                            afact = answerset[i][j].slice(10, answerset[i][j].length - 1);
                                                                            afact = afact.split(',');
                                                                            examschedule[i][j] = `{"coursecode": ${afact[0]},"date": ${afact[1]},"time": ${afact[2]},"hall": ${afact[3]}}`;

                                                                            //console.log('time: '+afact[2]);
                                                                        }
                                                                    }
                                                                    //console.log(examschedule); 
                                                                    //console.log(dates);
                                                                    var notadded = true;

                                                                    for (let e in examschedule) {
                                                                        notadded = true;
                                                                        for (let f in examschedule[e]) {
                                                                            //console.log(4);
                                                                            loop1:
                                                                            for (let d in dates) {
                                                                                //console.log(`${date[d]}`);
                                                                                //console.log(JSON.parse(examschedule[e][f]).date);
                                                                                if (`${dates[d]}` == JSON.parse(examschedule[e][f]).date) {
                                                                                    //console.log(1);
                                                                                    for (let t in time) {
                                                                                        //console.log(`${time[t]}`);
                                                                                        //console.log(JSON.parse(examschedule[e][f]).time);
                                                                                        if (`${time[t]}` == JSON.parse(examschedule[e][f]).time) {
                                                                                            //for (let i in arrangedexams) {
                                                                                            for (let j in arrangedexams[e]) {
                                                                                                if (arrangedexams[e][j].date == `${dates[d]}` && arrangedexams[e][j].time == `${time[t]}`) {
                                                                                                    //     ..  examschedule[e][f]).date ...   examschedule[e][f]).time
                                                                                                    arrangedexams[e][j].courses += ` <br> ${JSON.parse(examschedule[e][f]).coursecode} (${JSON.parse(examschedule[e][f]).hall})`;
                                                                                                    notadded = false;
                                                                                                    //console.log('YES - notadded: ' + notadded + ' - ' + i + ' : ' + j);
                                                                                                    break loop1;
                                                                                                } else {
                                                                                                    notadded = true;
                                                                                                    // console.log('NO - notadded: ' + notadded + ' - ' + i + ' : ' + j);

                                                                                                    //  }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }//console.log( arrangedexams)
                                                                            if (notadded) { //console.log("EEEEEEEEe: "+e);

                                                                                arrangedexams[e][f] = JSON.parse(`{
                                                                                "courses": "${JSON.parse(examschedule[e][f]).coursecode} (${JSON.parse(examschedule[e][f]).hall})",
                                                                                "date": "${JSON.parse(examschedule[e][f]).date}",
                                                                                "time": "${JSON.parse(examschedule[e][f]).time}"
                                                                            }`);
                                                                            }
                                                                        }
                                                                    }

                                                                    //Now we want to generate the HTML table
                                                                    var examhtmltable = ""; /* ` <table border=1> <tr>
                                                                     <th> Date/Time </th> 
                                                                     <th> 8am-10am </th> 
                                                                     <th> 10am-12pm </th> 
                                                                     <th> 12pm-2pm </th> 
                                                                     <th> 2pm-4pm </th> 
                                                                     <th> 4pm-6pm </th>
                                                                     </tr>`; */
                                                                    var ptime = 1;

                                                                    for (let ii in answerset) {
                                                                        examhtmltable += ` <form name='formapprovedexamtimeable'> <p>
                                                                         <table border=1> <tr>
                                                                     <th> Date/Time </th> `;
                                                                        for (let t in examtimesIndex) {
                                                                            examhtmltable += `<th> ${examtimesIndex[t].substring(1, examtimesIndex[t].length - 1)} </th>`;
                                                                        }
                                                                        examhtmltable += `</tr>`;

                                                                        for (let d in dates) {
                                                                            ptime = 0;
                                                                            examhtmltable += ` <tr> <td> <b> ${dates[d]} </b> </td>  `;
                                                                            for (let t in time) {
                                                                                loopA:
                                                                                //for(let i in arrangedexams){
                                                                                for (let j in arrangedexams[ii]) {
                                                                                    //console.log(dates[d]);
                                                                                    //console.log(arrangedexams[ii][j].date);
                                                                                    if (dates[d] == arrangedexams[ii][j].date & time[t] == arrangedexams[ii][j].time) {
                                                                                        var timeInt = time[t];
                                                                                        var cp = ptime;
                                                                                        for (let i = 1; i < timeInt - cp; i++) {
                                                                                            examhtmltable += `<td>  </td>`;
                                                                                            ptime += i;
                                                                                        }
                                                                                        examhtmltable += `<td> ${arrangedexams[ii][j].courses} </td>`;
                                                                                        ptime++;
                                                                                        break loopA;
                                                                                        // }
                                                                                    }
                                                                                }
                                                                            }
                                                                            examhtmltable += `</tr>`;
                                                                        }
                                                                        var htmltable = examhtmltable + "</table> </p> </form>";
                                                                        examhtmltable += `</table> </p> <input type='hidden' name='examtimetablehtml' value="${htmltable}" >  </form> `;

                                                                    }

                                                                    //End HTML table
                                                                    console.log(aspprogram);

                                                                    res.send(examhtmltable);
                                                                    //res.send(examschedule);
                                                                    //console.log(examschedule);
                                                                    //console.log(examschedule.length);
                                                                    //    res.send(arrangedexams);
                                                                    // console.log(arrangedexams[0][0]);
                                                                    // console.log(arrangedexams[1][0]);
                                                                    //console.log(arrangedexams);
                                                                    // console.log(arrangedexams.length);
                                                                }
                                                            );
                                                        }
                                                    }
                                                }

                                            });
                                        }
                                    });
                                }
                            }
                        });
                    };
                }
            });
        }
    });
});


//-----Lookup the college db table for the referenced id-------
router.post('/college/quicklookup', function (req, res, next) {
    runQuery('college', 'collegeID', res);
});
//-----Lookup the 'staff' db table for the referenced id-------
router.post('/staff/quicklookup', function (req, res, next) {
    runQuery('staff', 'staffid', res);
});
//-----Lookup the 'nextofkin' db table for the referenced id-------
router.post('/nextofkin/quicklookup', function (req, res, next) {
    runQuery('nextofkin', 'nextofkinid', res);
});
//-----Lookup the 'class' db table for the referenced id-------
router.post('/classes/quicklookup', function (req, res, next) {
    runQuery('class', 'name', res);
});
//-----Lookup the 'subject' db table for the referenced id-------
router.post('/subjects/quicklookup', function (req, res, next) {
    runQuery('subject', 'name', res);
});

function runQuery(dbtable, keyfield, res) {
    database.searchAllRecords(dbtable, false, false, function (error, results, fields) {
        var response = { 'results': results, 'dbtable': dbtable, 'keyfield': keyfield };
        if (!error) {
            res.send(response);
        }
    });
}

module.exports = router;