var express = require('express');
var router = express.Router();
const MYSQLDB = require('MYSQLDB');
const clingo = require("clingo-wasm");
var database = new MYSQLDB();

/* GET home page. */
router.get('/', function (req, res, next) {
    session = req.session;
    username = session.username;
    if (username) {
        res.render('admin', { title: 'Administrator' });
    } else {
        res.redirect('/staff/login');
    }

});
router.post('/', function (req, res, next) {
    session = req.session;
    session.username = username = req.body.username;
    if (username) {
        res.render('admin', { title: 'Administrator' });
    } else {
        res.redirect('/staff/login');
    }

});

// admin/examtimetable
router.post('/examtimetable', function (req, res, next) {
    var numberoftimetables = req.body.numberoftimetables;
    var coursefacts = [];
    var programs = [];
    var courseyears = [];
    var aspprogram = "";
    var carryoverStudentPrograms = [];
    var COSPyears = [];
    var dates = [];
    var time = [];
    var timew = ["1", "2"];
    var answerset = [];
    var examschedule = arrangedexams = [[], [], [], [], [], [], [], [], [], [],
    [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];

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
        t5f: ['course_to_date', 'course_to_time', 'excludeprogramme']
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
            }
            console.log(dates);
            dates.forEach((el, i) => { dates[i] = dates[i].substring(1, dates[i].length - 1) });
            console.log(2);
            examtimesIndex = examtimes.split(';');
            examtimesIndex.forEach((el, i) => {
                if (i + 1 == examtimesIndex.length) {
                    timefact += `"${i + 1}").`;
                } else {
                    timefact += `"${i + 1}";`;
                }
                time.push(`${i + 1}`);

            });
            console.log(3);
        }
    });
    
    console.log(4);

    database.searchDistinctRecords(dbtables.t5, dbfields.t5f, dbcolumns.t5c, values, function (error, results, fields) {
        
        console.log(4);
        if (results.length > 0) {
            for (var i in results) {
                aspconstraints += `${results[i].course_to_date}`;
                aspconstraints += `${results[i].course_to_time}`;
                aspconstraints += `${results[i].excludeprogramme}`;
            }
        }
    }); 
    
    console.log(5);

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
                                                for (let i = 0; i < coursefacts.length; i++) {
                                                    if (coursefacts[i].coursecode == result[r].courseCode) {
                                                        coursefacts[i].noOfStudents = result.length;
                                                    }
                                                }
                                            }
                                        }
                                        coursecodesCounter++;
                                        var room = [];
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
                                                        for (let cy in coursefacts[c].courseyears) {
                                                            if (cy == (coursefacts[c].courseyears.length - 1)) {
                                                                courseyear += `"${coursefacts[c].courseyears[cy]}"`;
                                                            } else {
                                                                courseyear += `"${coursefacts[c].courseyears[cy]}" ; `;
                                                            }
                                                        }
                                                        //courseyear = `"${coursefacts[c].courseyears[0]}"`;
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
                                                        for (let cop in coursefacts[c].carryoverProg){
                                                            program = coursefacts[c].carryoverProg[cop];
                                                            notadded = true;
                                                            for (let pr in coprogram) {
                                                                for (let icop in coursefacts[c].carryoverProg) {
                                                                    if (coprogram[pr] == coursefacts[c].carryoverProg[icop] & program == coprogram[pr]) {
                                                                        copcounter++;
                                                                    }
                                                                }
                                                            }
                                                            if (copcounter > 1) {
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
                                                                if (noting == (coursefacts[c].carryoverProg.length)) {
                                                                    coprogramfacts += `"${program}", (${coyears}`;
                                                                    coyears = '';
                                                                } else {
                                                                    coprogramfacts += `"${program}", (${coyears} ; `;
                                                                    coyears = '';
                                                                }
                                                                
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

                                                        aspprogram += `course(${cc}, (${programs}), (${courseyear}), ${noOfStudents}, (${coprogramfacts})).`;

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


%One level's course 1 day
:- scheduled (C, D, T,_), scheduled (C', D', T',_), course(C, P, Y, _,_),course(C', P'', Y'', _,_), C != C',  Y == Y'', D == D', P == P''.


%Next course must not be in same hall as previous course
%:- scheduled (C, D, T,R), scheduled (C', D', T+1,R'), R == R', C != C'.
%:- scheduled (C, D, T-1,R), scheduled (C', D', T',R'), R == R', C != C'.

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
carryoverClash(C,C') :- course(C,_,Yr1,_,(Pro,Yr)), course(C',_,Yr1',_,(Pro',Yr')), C != C', Pro == Pro', Yr == Yr', Yr1 == Yr1'.
%carryoverClash(C,C') :- course(C,_,_,_,(Pro,Yr)), course(C',_,_,_,(Pro',Yr')), C != C', Pro == Pro', Yr == Yr'.
%Avoiding carry over clashes
:- scheduled(C,D,T,_), scheduled(C',D',T',_), D == D', T == T', carryoverClash (C, C').
%Departmental courses should be taken in the college building (or designated) and not outside it. A penalty cost is %calculated when departmental courses are taken in separate [far way] buildings
%:- scheduled(C,_,_,R), course(C,P,Y,_,_,_), room(R,B,_), programToroom(P', Y', room(R,B',_)), P == P', Y == Y', B != B'. 


#show scheduled/4.
                                                            `; console.log(aspprogram);

                                                            clingo.run(aspprogram, numberoftimetables).then(
                                                                value => {
                                                                    for (let i in value.Call[0].Witnesses) {
                                                                        answerset[i] = value.Call[0].Witnesses[i].Value;
                                                                    }

                                                                    // We now need to get the values off 'answerset' and put
                                                                    // them into an organized array for our own use.
                                                                    // 1st: strip value (i.e answerset[i][j]) off the 'scheduled' word and then the
                                                                    // last character which is the bracket
                                                                    var afact = '';
                                                                    for (let i in answerset) {
                                                                        for (let j in answerset[i]) {
                                                                            afact = answerset[i][j].slice(10, answerset[i][j].length - 1);
                                                                            afact = afact.split(',');
                                                                            examschedule[i][j] = `{"coursecode": ${afact[0]},"date": ${afact[1]},"time": ${afact[2]},"hall": ${afact[3]}}`;
}
                                                                    }
                                                                    var notadded = true;

                                                                    for (let e in examschedule) {
                                                                        notadded = true;
                                                                        for (let f in examschedule[e]) {
                                                                            loop1:
                                                                            for (let d in dates) {
                                                                                if (`${dates[d]}` == JSON.parse(examschedule[e][f]).date) {
                                                                                    for (let t in time) {
                                                                                        if (`${time[t]}` == JSON.parse(examschedule[e][f]).time) {
                                                                                            for (let j in arrangedexams[e]) {
                                                                                                if (arrangedexams[e][j].date == `${dates[d]}` && arrangedexams[e][j].time == `${time[t]}`) {
                                                                                                   arrangedexams[e][j].courses += ` <br> ${JSON.parse(examschedule[e][f]).coursecode} (${JSON.parse(examschedule[e][f]).hall})`;
                                                                                                    notadded = false;                                                                                                    
                                                                                                    break loop1;
                                                                                                } else {
                                                                                                    notadded = true;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                            if (notadded) {
                                                                                arrangedexams[e][f] = JSON.parse(`{
                                                                                "courses": "${JSON.parse(examschedule[e][f]).coursecode} (${JSON.parse(examschedule[e][f]).hall})",
                                                                                "date": "${JSON.parse(examschedule[e][f]).date}",
                                                                                "time": "${JSON.parse(examschedule[e][f]).time}"
                                                                            }`);
                                                                            }
                                                                        }
                                                                    }

                                                                    //Now we want to generate the HTML table
                                                                    var examhtmltable = `<!DOCTYPE html><html><head>
                                                                    <title>Generated Timetable - Examination Timetabling System</title>
                                                                    <link rel="icon" type="image/png" href="/images/favicon.png">
                                                                    <link rel="stylesheet" type="text/css" href="/stylesheets/style.css">
                                                                    <link rel="stylesheet" type="text/css" href="/stylesheets/font-awesome-4.7.0/css/font-awesome.css">
                                                                    <link rel="stylesheet" type="text/css" href="/stylesheets/adminStyle.css"><link rel="stylesheet" type="text/css" href="/stylesheets/smsStyle.css">
                                                                    </head>
                                                                    <body>
                                                                    <h2 class='heading lg txt_middle'>
                                                                        Generated Timetables<br>
                                                                        </h2>
                                                                    `;
                                                                    var singlehtmlexamtable = "";
                                                                    var nooftimetables = 0;
                                                                    var ptime = 1;

                                                                    for (let ii in answerset) {
                                                                        examhtmltable += ` <form name='formapprovedexamtimeable' method='POST' target='_blank' action='approveexamtimetable'> <p>
                                                                         <table border=1> <tr>
                                                                     <th> Date/Time </th> `;
                                                                        singlehtmlexamtable += ` <form name='formapprovedexamtimeable'> <p>
                                                                         <table border=1> <tr>
                                                                     <th> Date/Time </th> `;
                                                                        for (let t in examtimesIndex) {
                                                                            examhtmltable += `<th> ${examtimesIndex[t].substring(1, examtimesIndex[t].length - 1)} </th>`;
                                                                            singlehtmlexamtable += `<th> ${examtimesIndex[t].substring(1, examtimesIndex[t].length - 1)} </th>`;
                                                                        }
                                                                        examhtmltable += `</tr>`;
                                                                        singlehtmlexamtable += `</tr>`;

                                                                        for (let d in dates) {
                                                                            ptime = 0;
                                                                            examhtmltable += ` <tr> <td> <b> ${dates[d]} </b> </td>  `;
                                                                            singlehtmlexamtable += ` <tr> <td> <b> ${dates[d]} </b> </td>  `;
                                                                            for (let t in time) {
                                                                                loopA:
                                                                                for (let j in arrangedexams[ii]) {
                                                                                    if (dates[d] == arrangedexams[ii][j].date & time[t] == arrangedexams[ii][j].time) {
                                                                                        var timeInt = time[t];
                                                                                        var cp = ptime;
                                                                                        for (let i = 1; i < timeInt - cp; i++) {
                                                                                            examhtmltable += `<td>  </td>`;
                                                                                            singlehtmlexamtable += `<td>  </td>`;
                                                                                            ptime += i;
                                                                                        }
                                                                                        examhtmltable += `<td> ${arrangedexams[ii][j].courses} </td>`;
                                                                                        singlehtmlexamtable += `<td> ${arrangedexams[ii][j].courses} </td>`;
                                                                                        ptime++;
                                                                                        break loopA;
                                                                                    }
                                                                                }
                                                                            }
                                                                            examhtmltable += `</tr>`;
                                                                            singlehtmlexamtable += `</tr>`;
                                                                        }
                                                                        var htmltable = `${singlehtmlexamtable} </table> </form>`;
                                                                        singlehtmlexamtable = "";
                                                                        nooftimetables++;
                                                                        examhtmltable += `</table> </p> <input type="hidden" value="${htmltable}" name="examtimetablehtml">
                                                                            <button type='submit' class="bttn in-take-100p uploadbtn"> Approve timetable ${nooftimetables} <i class="fa fa-hand-o-up" aria-hidden="true"></i></button> </form> `;
                                                                    }

                                                                    if (answerset.length == 0) {
                                                                        examhtmltable += `<h2 class='heading lg mrg_top_2em txt_middle'>
                                                                        Unable to generate examination timetable<br>
                                                                         Constraints unsatisfiable! </h2>`;
                                                                    }

                                                                    examhtmltable += `<script src="/javascripts/adminscript.js"></script>
                                                                    <script src="/javascripts/modalscript.js"></script>
                                                                    <script src="/javascripts/jquery-3.4.1.min.js">
                                                                    </script><script src="/javascripts/asynccalls.js">
                                                                    </script><script src="/javascripts/script.js">
                                                                    </script></body></html>`;

                                                                    res.send(examhtmltable);
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


// admin/approveexamtimetable
router.post('/approveexamtimetable', function (req, res, next) {
    var htmltimetable = req.body.examtimetablehtml;
    var dbtable = 'approvedexamtimetable';
    var dbcolumns = ['htmltimetable'];
    var record = [htmltimetable];

    database.deleteAllRecord(dbtable, function (error, results, fields) {
        database.insertRecord(dbtable, dbcolumns, record, function (error, results, fields) {
            var jsonresponse = { 'error': error, 'results': results };
            if (error) {
                console.log(error);
                return next(error);
            }
            console.log(htmltimetable);
            res.send(`<!DOCTYPE html><html><head><title>
        Approved Timetable - Examination Timetabling System</title>
        <link rel="stylesheet" type="text/css" href="/stylesheets/studentprofileStyle.css">
        <link rel="stylesheet" type="text/css" href="/stylesheets/adminStyle.css">
        <link rel="icon" type="image/png" href="/images/favicon.png">
        <link rel="stylesheet" type="text/css" href="/stylesheets/style.css"></head><body>
        <p class="heading lg mrg_top_2em"> Saved examination timetable!</p>
        ${htmltimetable}
        </body>
        </html>
        `);
        });
    });
});


router.post('/viewexamtimetable', function (req, res, next) {
    var dbtable = 'approvedexamtimetable';
    var dbcolumns = [];
    var values = [];
    var htmltimetable = '';
    console.log('1');
    if (req.params.deletetimetable == 'true') {
        console.log(100);
        database.deleteAllRecord(dbtable, function (error, results, fields) { });
    }
    database.searchAllRecords(dbtable, dbcolumns, values, function (error, result, fields) {
        if (result.length > 0) {
            for (let r in result) {
                htmltimetable = result[r].htmltimetable;
            }
        }
        console.log(htmltimetable);
        if (htmltimetable == '') {
            htmltimetable = `<br><h3 class="heading lg">No approved exam timetable!</h3>`;
        } else {
            htmltimetable += `
        <form method='GET' action='' target='_blank'>
        <input type='hidden' name='deletetimetable' value='true'>
        <button type='submit' class="bttn in-take-100p deletebtn"> Delete timetable </button>
        </form>
        </body>
        </html>`;
        }
        res.send(`<!DOCTYPE html><html><head><title>
        Approved Exam Timetable - Examination Timetabling System</title>
        <link rel="stylesheet" type="text/css" href="/stylesheets/studentprofileStyle.css">
        <link rel="stylesheet" type="text/css" href="/stylesheets/adminStyle.css">
        <link rel="icon" type="image/png" href="/images/favicon.png">
        <link rel="stylesheet" type="text/css" href="/stylesheets/style.css"></head><body>
        <h2 class="heading lg"> Approved examination timetable </h2>
        ${htmltimetable}
        `);
    });
});


router.get('/viewexamtimetable/:deletetimetable?', function (req, res, next) {
    var dbtable = 'approvedexamtimetable';
    database.deleteAllRecord(dbtable, function (error, results, fields) {

        res.send(`<!DOCTYPE html><html><head><title>
        Deleted Exam Timetable - Examination Timetabling System</title>
        <link rel="stylesheet" type="text/css" href="/stylesheets/studentprofileStyle.css">
        <link rel="stylesheet" type="text/css" href="/stylesheets/adminStyle.css">
        <link rel="icon" type="image/png" href="/images/favicon.png">
        <link rel="stylesheet" type="text/css" href="/stylesheets/style.css"></head><body>
        <h2 class="heading lg"> Timetable deleted! </h2>
        </body>
        </html>
        `);
    });
});



module.exports = router;
