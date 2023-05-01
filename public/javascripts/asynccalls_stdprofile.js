"use strict";

var formstdcoursequery = $("#formstdcoursequery");
var formstdcourseresultquery = $("#formstdcourseresultquery");
var formeditsponsor = document.querySelector("#formeditsponsor");
var feedback = $(".feedback");
var uploadbutton = $(".uploadbtn");
var queryresult = document.getElementsByClassName('queryresult');
var registeredcreditunit = 0;
var creditunitlimit = 0;


//#################################################################
//--------------- For the Student Profile Page ------------------
//-------- This is for the 'View Courses' option in the Student page --------
formstdcoursequery.on('submit', (function (e) {
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/querydb/studentcourse",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if (result === 'false') {
            displayFeedback('No record found!', true)
            queryresult[7].innerHTML = "";
            enableButton('.querybtn');
        } else {
            displayFeedback(`${result.serialnumber - 1} courses found!`, false)
            queryresult[7].innerHTML = result.output;
            console.log('result.registeredorunbtns: ' + result.registeredorunbtns);
            for (let i = result.firstcoursecount; i < result.serialnumber + 1; i++) {
                new CourseRegistry().registercourse(i, result.registeredbtns, result.unregisteredbtns);

                uploadbutton.attr('disabled', false);
            }
            registeredcreditunit = result.registeredcreditunit;
            creditunitlimit = result.creditunitlimit;
            // alert(creditunitlimit);
            //Set the values for the registered course units and the units limit
            totalunits_db.innerHTML = creditunitlimit;
            registeredunits_lbl.innerHTML = registeredcreditunit;
            uploadbutton.attr('disabled', false);

            enableButton('.querybtn');
        }
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
    });
}));
//--------------------- End 'View Courses' ------------------------

//-------- This is for the 'View Course Result' option in the Student page --------
formstdcourseresultquery.on('submit', (function (e) {
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/querydb/studentresult",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if (result === 'false') {
            displayFeedback('No result available!', true)
            queryresult[8].innerHTML = "";
            enableButton('.querybtn');
            uploadbutton.attr('disabled', false);
        } else {
            displayFeedback(`${result.rowsInserted} result(s) available!`, false)
            queryresult[8].innerHTML = result.output;
            enableButton('.querybtn');
            uploadbutton.attr('disabled', false);
        }
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
    });
}));
//--------------------- End 'View Course Result' ------------------------

//--------------- End Student Profile Page ------------------
//#########################################################

//---------------- function for feedback display ------------------------
function displayFeedback(message, error, pk, view_error_report) {
    var feedback_close_element = "<span class = 'feedback_close'> &times; </span>";
    var details_element = '';
    if (view_error_report) {
        details_element = `<form method='POST' action = '/staff/admin/report/detailed/' target=_blank> <input type='hidden' name='duplicateRecords' value = '${pk}'> <button class='view_details_link'>view report</button></form>`;
    }
    feedback.removeClass('display_none');
    if (error) {
        feedback.removeClass('success_fb');
        feedback.addClass('error_fb');
    } else {
        feedback.removeClass('error_fb');
        feedback.addClass('success_fb');
    }
    feedback.html(`${feedback_close_element}${message} ${details_element}`);
}
//--------------------- end displayFeedback --------------------------
//--------Function to Enable disabled button ----------
function enableButton(buttonref, defaultText) {
    $(buttonref).attr('disabled', false);
    if (defaultText) {
        buttonref.text(defaultText);
    }
}
//--------------- End enableButton() ------------------

//------ Class for responding "Register course" click event --------

var maxCourseunit = '24';
var totalcourseunit = 0;

class CourseRegistry {
    constructor() { }
    registercourse(formindex, registeredbtns, unregisteredbtns) {
        //-------- This is for the 'formregistercoursebtn' option in the Student page --------
        var formregisterpercourse = $(`#formregisterpercourse_${formindex}`);
        var registercoursebtn = $(`#registercoursebtn_${formindex}`);

        registercoursebtn.attr('disabled', registeredbtns[formindex]);
        formregisterpercourse.on('submit', (function (e) {
            e.preventDefault();
            //uploadbutton.attr('disabled', 'disabled');
            //uploadbutton.text('processing...');
            var request = $.ajax({
                url: "/staff/admin/upload/registercourse",
                contentType: false,
                method: "POST",
                cache: false,
                processData: false,
                data: new FormData(this)
            });
            request.done(function (jsonresponse) {
                var error = jsonresponse.error;
                var results = jsonresponse.results;
                var coursecreditunit = parseInt(jsonresponse.coursecreditunit);
                if (results === 'false') {
                    displayFeedback('No record found!', true)
                    queryresult[7].innerHTML = "";
                    enableButton('.querybtn');
                } else {
                    if ((registeredcreditunit + coursecreditunit) <= creditunitlimit) {
                        registeredcreditunit += coursecreditunit;
                        registercoursebtn.attr('disabled', true);
                        unregistercoursebtn.attr('disabled', false);
                        //alert(coursecreditunit);
                        //alert(registeredcreditunit );
                        registeredunits_lbl.innerHTML = registeredcreditunit;
                    } else {
                        alert('You have reached the course unit limit!');
                    }
                }
            });
            request.fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
                enableButton('.querybtn');
            });
        }));
        //--------------------- End formregistercoursebtn ------------------------

        //-------- This is for the 'formunregistercoursebtn' option in the Student page --------
        var formunregisterpercourse = $(`#formunregisterpercourse_${formindex}`);
        var unregistercoursebtn = $(`#unregistercoursebtn_${formindex}`);
        //alert("unreg: "+formindex);
        unregistercoursebtn.attr('disabled', unregisteredbtns[formindex]); //This is the default
        //alert( registeredorunbtns[formindex]);
        formunregisterpercourse.on('submit', (function (e) {
            e.preventDefault();
            //uploadbutton.attr('disabled', 'disabled');
            //uploadbutton.text('processing...');
            var request = $.ajax({
                url: "/staff/admin/upload/unregistercourse",
                contentType: false,
                method: "POST",
                cache: false,
                processData: false,
                data: new FormData(this)
            });
            request.done(function (jsonresponse) {
                var error = jsonresponse.error;
                var results = jsonresponse.results;
                var coursecreditunit = parseInt(jsonresponse.coursecreditunit);
                if (results === 'false') {
                    displayFeedback('No record found!', true)
                    queryresult[7].innerHTML = "";
                    enableButton('.querybtn');
                } else {
                    registeredcreditunit -= parseInt(coursecreditunit);
                    registercoursebtn.attr('disabled', false);
                    unregistercoursebtn.attr('disabled', true);
                    // alert(coursecreditunit);
                    //alert(registeredcreditunit );
                    registeredunits_lbl.innerHTML = registeredcreditunit;
                }
            });
            request.fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
                enableButton('.querybtn');
            });
        }));
        //--------------------- End formregistercoursebtn ------------------------
    }
}

//------ END Class for responding "Register course" click event -------