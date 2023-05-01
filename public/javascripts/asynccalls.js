"use strict";

var formuploadstdlist = $("#formuploadstdlist");
var formuploadresult = $("#formuploadresult");
var formuploadcourselist = $("#formuploadcourselist");
var form_viewUploadedResultStaff = $('#form_viewUploadedResultStaff');
var formstudentquery = $("#formstudentquery");
var formcollegequery = $("#formcollegequery");
var formprogramquery = $("#formprogramquery");
var formdepartmentquery = $("#formdepartmentquery");
var formcoursequery = $("#formcoursequery");
var formsubjectquery = $("#formsubjectquery");
var formresultquery = $("#formresultquery");
var formexamhallquery = $("#formexamhallquery");
var formaddclass = $("#formaddclass");
var formaddsubject = $("#formaddsubject");
var formaddcollege = $("#formaddcollege");
var formadddepartment = $("#formadddepartment");
var formaddprogram = $("#formaddprogram");
var formaddexamhall = $("#formaddexamhall");
var formstdcoursequery = $("#formstdcoursequery");
var formsetsemester = $("#formsetsemester");
var formsetcreditunit = $("#formsetcreditunit");
var formsetconstraints = $("#formsetconstraints");
var formsetexamdateandTime = $("#formsetexamdateandTime");

var formeditsponsor = document.querySelector("#formeditsponsor");
var feedback = $(".feedback");
var uploadbutton = $(".uploadbtn");
var querybutton = $(".querybtn");

//--------- This handles the student list upload -------------
formuploadstdlist.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/upload/student",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var isSame = jsonresponse.isSame;
        var duplicateRecords = jsonresponse.duplicateRecords; 
        var primarykey = [];
        if (error) {
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
            formuploadstdlist[0].reset();
        }
        if(duplicateRecords.length){
                for(let i = 0; i < duplicateRecords.length; i++){
                    for(let j = 0; j < duplicateRecords[i].length; j++){
                    primarykey.push(duplicateRecords[i][j].admissionno);
                }
            }
            if(isSame){
                displayFeedback("List already uploaded!", true);
            }else{
                displayFeedback("List partly uploaded!", true, primarykey, true);
            }
            formuploadstdlist[0].reset();
        }
        else{
            displayFeedback("Upload success!", false);
            formuploadstdlist[0].reset();
        }
        enableButton(uploadbutton);
    });
    request.fail(function (jqXHR, textStatus){
        displayFeedback("An error occured!", true);
        enableButton(uploadbutton);
    });
}));
//--------------- End student list upload -----------------

//--------- This handles the course list upload -------------
formuploadcourselist.on('submit', (function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/upload/course",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var isSame = jsonresponse.isSame;
        var duplicateRecords = jsonresponse.duplicateRecords; 
        var primarykey = [];
        if (error) {
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        }
        formuploadcourselist[0].reset();
        if(duplicateRecords.length){
                for(let i = 0; i < duplicateRecords.length; i++){
                    for(let j = 0; j < duplicateRecords[i].length; j++){
                    primarykey.push(duplicateRecords[i][j].admissionno);
                }
            }
            if(isSame){
                displayFeedback("List already uploaded!", true);
            }else{
                displayFeedback("List partly uploaded!", true, primarykey, true);
            }
            formuploadcourselist[0].reset();
        }
        else{
            displayFeedback("Upload success!", false);            
        formuploadcourselist[0].reset();
        }
        enableButton(uploadbutton,'Upload');        
        formuploadcourselist[0].reset();
    });
    request.fail(function (jqXHR, textStatus){
        displayFeedback("An error occured!", true);
        enableButton(uploadbutton,'Upload');
    });
}));
//--------------- End course list upload -----------------

// -------------- Student Result upload --------------------
formuploadresult.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/upload/result",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if (error) {
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
            formuploadresult[0].reset();
        }
        if(results.length > 0){
            displayFeedback("This result has been uploaded already!", true);
            formuploadresult[0].reset();
        }
        else{
            displayFeedback("Upload success!", false);
            formuploadresult[0].reset();
        }
        enableButton(uploadbutton,'Upload');
    });
    request.fail(function (jqXHR, textStatus) {
        displayFeedback("An error occured!", true);
        enableButton(uploadbutton,'Upload');
    });
}));
// ------------- End student result upload -------------
//-------- This is for the 'View student' option in the admin page --------
var queryresult = document.getElementsByClassName('queryresult');
formstudentquery.on('submit',(function (e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/querydb/student",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if(result === 'false'){
            displayFeedback('No record found!', true)
            queryresult[0].innerHTML = "";
            enableButton('.querybtn');
        }else{
            displayFeedback(`${result.rowsInserted} record(s) found!`, false)
            queryresult[0].innerHTML = result.output;
            enableButton('.querybtn');
        }
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
    });
}));
//--------------------- End View student ------------------------
//-------- This is for the 'View Department' option in the admin page --------
//var queryresult1 = document.getElementsByClassName('queryresult')[1];
formdepartmentquery.on('submit',(function (e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/querydb/department",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if(result === 'false'){
            displayFeedback('No record found!', true)
            queryresult[3].innerHTML = "";
            enableButton('.querybtn');
        }else{
            displayFeedback(`${result.rowsInserted} record(s) found!`, false)
            queryresult[3].innerHTML = result.output;
            enableButton('.querybtn');
        }
        uploadbutton.attr('disabled', false);
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
        uploadbutton.attr('disabled', false);
    });
}));
//--------------------- End View Staff ------------------------

//-------- This is for the 'View Program' option in the admin page --------
formprogramquery.on('submit',(function (e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/querydb/program",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if(result === 'false'){
            displayFeedback('No record found!', true)
            queryresult[4].innerHTML = "";
            enableButton('.querybtn');
        }else{
            displayFeedback(`${result.rowsInserted} record(s) found!`, false)
            queryresult[4].innerHTML = result.output;
            enableButton('.querybtn');
        }
        uploadbutton.attr('disabled', false);
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
        uploadbutton.attr('disabled', false);
    });
}));
//--------------------- End View Parent ------------------------

//-------- This is for the 'View College' option in the admin page --------

formcollegequery.on('submit',(function (e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/querydb/college",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if(result === 'false'){
            displayFeedback('No record found!', true)
            queryresult[2].innerHTML = "";
            enableButton('.querybtn');
        }else{
            displayFeedback(`${result.rowsInserted} record(s) found!`, false)
            queryresult[2].innerHTML = result.output;
            enableButton('.querybtn');
        }
        uploadbutton.attr('disabled', false);
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
        uploadbutton.attr('disabled', false);
    });
}));
//--------------------- End View College ------------------------

//-------- This is for the 'View Course' option in the admin page --------
formcoursequery.on('submit',(function (e){
    e.preventDefault();
    //uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/querydb/course",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if(result === 'false'){
            displayFeedback('No record found!', true)
            queryresult[5].innerHTML = "";
            enableButton('.querybtn');
        }else{
            displayFeedback(`${result.rowsInserted} record(s) found!`, false)
            queryresult[5].innerHTML = result.output;
            enableButton('.querybtn');
        }
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
    });
}));
//--------------------- End View Course ------------------------

//-------- This is for the 'View Result' option in the admin page --------
formresultquery.on('submit',(function (e){
    e.preventDefault();
    //uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/querydb/result",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if(result === 'false'){
            displayFeedback('No record found!', true)
            queryresult[5].innerHTML = "";
            enableButton('.querybtn');
        }else{
            displayFeedback(`${result.rowsInserted} record(s) found!`, false)
            queryresult[5].innerHTML = result.output;
            enableButton('.querybtn');
        }
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
    });
}));
//--------------------- End View Result ------------------------

//-------- This is for the 'View Exam Hall' option in the admin page --------
formexamhallquery.on('submit',(function (e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/querydb/examhall",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if(result === 'false'){
            displayFeedback('No record found!', true)
            queryresult[6].innerHTML = "";
            enableButton('.querybtn');
        }else{
            displayFeedback(`${result.rowsInserted} record(s) found!`, false)
            queryresult[6].innerHTML = result.output;
            enableButton('.querybtn');
        }
        uploadbutton.attr('disabled', false);
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
        uploadbutton.attr('disabled', false);
    });
}));
//--------------------- End View Exam Hall ------------------------

//-------- This is for the 'Add class' option in the admin page --------
formaddclass.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/student/class",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        uploadbutton.attr('disabled', false);
        }
        if(results.length > 0){
            displayFeedback("This result has been uploaded already!", true);
        }
        else{
            displayFeedback("Added successfully!", false);
            //-- Now refresh the list in the 'add subject' modal box
            var table1;
            var table2; //Not used. It's here just to suppress the reference error
            var classesvalue = document.getElementById('classesvalue'); // to read the input value
            var classes = document.getElementById('classes'); // to hold the output result
            table1 = 'class';
            var datalistStore = {table1:datalist, table2:datalist};
            ajaxGetDbRows(datalistStore,classesvalue,table1,table2,classes);
        }
        uploadbutton.attr('disabled', false);
        //enableButton(uploadbutton,'Add');
    });
    request.fail(function(jqXHR, textStatus){
        alert("Request failed: " + textStatus);
        //enableButton(uploadbutton,'Add');
        uploadbutton.attr('disabled', false);
    });
}));
//--------------------- End 'Add class' ------------------------

//-------- This is for the 'Add subject' option in the admin page --------
formaddsubject.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/student/subject",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        uploadbutton.attr('disabled', false);
        }
        if(results.length > 0){
            displayFeedback("This result has been uploaded already!", true);
        }
        else{
            displayFeedback("Added successfully!", false);
        }
        uploadbutton.attr('disabled', false);
    });
    request.fail(function(jqXHR, textStatus){
        alert("Request failed: " + textStatus);
        uploadbutton.attr('disabled', false);
    });
}));
//--------------------- End 'Add subject' ------------------------

//-------- This is for the 'Add college' option in the admin page --------
formaddcollege.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/college",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        uploadbutton.attr('disabled', false);
        }
        if(results.length > 0){
            displayFeedback("This club has been added already!", true);
        }
        else{
            displayFeedback("Added successfully!", false);
        }
        uploadbutton.attr('disabled', false);
    });
    request.fail(function(jqXHR, textStatus){
        alert("Request failed: " + textStatus);
        uploadbutton.attr('disabled', false);
    });
}));
//--------------------- End 'Add college' ------------------------

//-------- This is for the 'Add department' option in the admin page --------
formadddepartment.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/department",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        uploadbutton.attr('disabled', false);
        }
        if(results.length > 0){
            displayFeedback("This club has been added already!", true);
        }
        else{
            displayFeedback("Added successfully!", false);
        }
        uploadbutton.attr('disabled', false);
    });
    request.fail(function(jqXHR, textStatus){
        alert("Request failed: " + textStatus);
        uploadbutton.attr('disabled', false);
    });
}));
//--------------------- End 'Add department' ------------------------


//-------- This is for the 'Add program' option in the admin page --------
formaddprogram.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/program",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        enableButton(uploadbutton,'Add');
        }
        if(results.length > 0){
            displayFeedback("This club has been added already!", true);
        }
        else{
            displayFeedback("Added successfully!", false);
        }
        enableButton(uploadbutton,'Add');
    });
    request.fail(function(jqXHR, textStatus){
        alert("Request failed: " + textStatus);
        enableButton(uploadbutton,'Add');
    });
}));
//--------------------- End 'Add program' ------------------------

//-------- This is for the 'Add exam hall' option in the admin page --------
formaddexamhall.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/examhall",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        uploadbutton.attr('disabled', false);
        }
        if(results.length > 0){
            displayFeedback("This club has been added already!", true);
        }
        else{
            displayFeedback("Added successfully!", false);
        }
        uploadbutton.attr('disabled', false);
    });
    request.fail(function(jqXHR, textStatus){
        alert("Request failed: " + textStatus);
        uploadbutton.attr('disabled', false);
    });
}));
//--------------------- End 'Add Exam hall' ------------------------


//-------- This is for the 'Set credit unit value' option in the admin page --------
formsetcreditunit.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/setcreditunit",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        uploadbutton.attr('disabled', false);
        }
        if(results.length > 0){
            displayFeedback("This record has been added already!", true);
        }
        else{
            displayFeedback("Credit unit set successfully!", false);
        }
        uploadbutton.attr('disabled', false);
    });
    request.fail(function(jqXHR, textStatus){
        alert("Request failed: " + textStatus);
        uploadbutton.attr('disabled', false);
    });
}));
//--------------------- End 'Set credit unit value' ------------------------


//-------- This is for the 'Set semester' option in the admin page --------
formsetsemester.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/setsemester",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        enableButton(uploadbutton);
        }
        if(results.length > 0){
            displayFeedback("This record has been added already!", true);
        }
        else{
            displayFeedback("Semester set successfully!", false);
        }
        enableButton(uploadbutton);
    });
    request.fail(function(jqXHR, textStatus){
        alert("Request failed: " + textStatus);
        enableButton(uploadbutton);
    });
}));
//--------------------- End 'Set semester' ------------------------

//-------- This is for the 'Set exam date and time' option in the admin page --------
formsetexamdateandTime.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/setexamdateandtime",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        enableButton(uploadbutton);
        }
        if(results.length > 0){
            displayFeedback("This record has been added already!", true);
        }
        else{
            displayFeedback("Date and time set successfully!", false);
        }
        enableButton(uploadbutton);
    });
    request.fail(function(jqXHR, textStatus){
        alert("Request failed: " + textStatus);
        enableButton(uploadbutton);
    });
}));
//--------------------- End 'Set exam date and time' ------------------------
/*
//-------- This is for the 'Set exam durations' option in the admin page --------
formsetexamdurations.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/setexamduration",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        }
        if(results.length > 0){
            displayFeedback("This record has been added already!", true);
        }
        else{
            displayFeedback("Semester set successfully!", false);
        }
        enableButton(uploadbutton);
    });
    request.fail(function(jqXHR, textStatus){
        alert("Request failed: " + textStatus);
        enableButton(uploadbutton);
    });
}));
//--------------------- End 'Set exam duration' ------------------------
*/

//----------- This stop the dafault event propagation: 'bubbling' ---------
//formeditsponsor.addEventListener('submit',function(e){
//  alert(3); e.stopPropagation();
    
//},false);
//------------------------ End event propagation --------------------------

//---------- For the 'Data already exists?' checkbox in the 'registerstudent' page ------------
var porstaff = $("#parentorstaff");
var nokorstaff = $("#nokorstaff");
var verifierlbl = $(".verifierlbl");
var datalist = '';
var selectedoption = '';

porstaff.on('change', function(){
    var parentorstaff = document.getElementById('parentorstaff');
    var table1 = 'parent';
    var table2 = 'staff';
    var datalistStore = {table1:datalist, table2:datalist};
    ajaxGetDbRows(datalistStore,parentorstaff,table1,table2,ids);
});
nokorstaff.on('change', function(){
    var norstaff = document.getElementById('nokorstaff');
    var table1 = 'nextofkin';
    var table2 = 'staff';
    var datalistStore = {table1:datalist, table2:datalist};
    ajaxGetDbRows(datalistStore,norstaff,table1,table2,ids);
});

function ajaxGetDbRows(datalistStore,inputfield,table1,table2,outputelement){
    //--'table1' and 'table2' are used in order to avoid rerunning the same query
    var datalist = "";
    selectedoption = inputfield.value;
    if(!(datalistStore.table1 && datalistStore.table2)){
        var theurl = "/staff/admin/querydb/" + selectedoption + "/quicklookup";
        var request = $.ajax({
        url: theurl,
        method: "POST",
        cache: false,
    });
    request.done(function(response){
        var results = response.results;
        var dbtable = response.dbtable;
        var keyfield = response.keyfield;
        for(let i = 0; i < results.length; i++){
            let data = results[i][keyfield] || '' ; //ex results[0][staffid] or result[1][nextofkinid]
            console.log(data);
            datalist += `<option value='${data}'>${data}</option>`;
        }
        outputelement.innerHTML = datalist;
        if(dbtable == table1){
            datalistStore.table1 = datalist;
        }else if(dbtable == table2){
            datalistStore.table2 = datalist;
        }
        //alert(datalist);
        return datalist;
    });
    request.fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
    });
}
if(selectedoption == table1){
    console.log(table1);
    outputelement.innerHTML = datalistStore.parent;
}else if(selectedoption == table2){
    console.log(table2);
    outputelement.innerHTML = datalistStore.staff;
}
}
//---------------------------------End 'Data already exists?'---------------------------------
//---------------- function for feedback display ------------------------
function displayFeedback(message, error, pk, view_error_report){
    var feedback_close_element = "<span class = 'feedback_close'> &times;</span>";
    var details_element = '';
    if(view_error_report){
       details_element = `<form method='POST' action = '/staff/admin/report/detailed/' target=_blank> <input type='hidden' name='duplicateRecords' value = '${pk}'> <button class='view_details_link'>view report</button></form>`;
    }
feedback.removeClass('display_none');
        if(error){
            feedback.removeClass('success_fb');
            feedback.addClass('error_fb');
           }else{
            feedback.removeClass('error_fb');
            feedback.addClass('success_fb');
        }
    feedback.html(`${feedback_close_element}${message} ${details_element}`);
}
//--------------------- end displayFeedback --------------------------
//--------Function to Enable disabled button ----------
function enableButton(buttonref,defaultText){
    $(buttonref).attr('disabled', false);
    if(defaultText){
        buttonref.text(defaultText);
    }
}
//--------------- End enableButton() ------------------

// ------------ Function to send the specific error message to the user -----------
function getErrorMessage(error){
    switch (error.code){
        case 'ER_DUP_ENTRY':
            return 'This file contains a field already present in the database.';
            break;
        case 'ER_TOO_LONG_IDENT':
            return 'Field too lengthy.';
            break;
        default:
            return '';
            break;
    }
}
// --------------------- End getErrorMessage() ---------------------
/*
//---------- This is the ajax code which will submit the 'Edit Student' form ----------
var formeditstudentdata = $("#formeditstudentdata");
formstudentresult.on('submit',(function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/upload/student/",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if (error) {
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        }
        if(results.length > 0){
            displayFeedback("This result has been uploaded already!", true);
        }
        else{
            displayFeedback("Upload success!", false);
        }
        enableButton(uploadbutton,'Upload');
    });
    request.fail(function (jqXHR, textStatus) {
        displayFeedback("An error occured!", true);
        enableButton(uploadbutton,'Upload');
    });
})); */
//----------------------- End ajax code for 'Edit Student' form --------------------------

//-------------------- For the 'View Uploaded Result' modal box --------------------
form_viewUploadedResultStaff.on('submit', (function(e){
    e.preventDefault();
    //uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/profile/viewuploadedresults/",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if(result === 'false'){
            displayFeedback('No record found!', true)
            uploadedResultQueryView.innerHTML = "";
            enableButton('.querybtn');
        }else{
            displayFeedback(`${result.rowsInserted} record(s) found!`, false)
            uploadedResultQueryView.innerHTML = result.output;
            enableButton('.querybtn');
        }
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
    });
}));
//-------------- End for 'View Uploaded Result' modal box ---------------


//-------------------- For the 'Set Constraints' modal box --------------------
formsetconstraints.on('submit', (function(e){
    e.preventDefault();
    uploadbutton.attr('disabled', 'disabled');
    var request = $.ajax({
        url: "/staff/admin/upload/setconstraints",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function(jsonresponse){
        var error = jsonresponse.error;
        var results = jsonresponse.results;
        console.log('ERROR: ' + error);
        if(error){
            var errormsg = getErrorMessage(error);
            displayFeedback(errormsg, true);
        enableButton(uploadbutton);
        }
        if(results.length > 0){
            displayFeedback("This record has been added already!", true);
        }
        else{
            displayFeedback("Constraints set successfully!", false);
        }
        enableButton(uploadbutton);
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
        enableButton(uploadbutton);
    });
}));
//-------------- End for 'Set Constraints' modal box ---------------

//#################################################################
//--------------- For the Student Profile Page ------------------
//-------- This is for the 'View Courses' option in the Student page --------
formstdcoursequery.on('submit',(function (e){
    e.preventDefault();
    //uploadbutton.attr('disabled', 'disabled');
    //uploadbutton.text('processing...');
    var request = $.ajax({
        url: "/staff/admin/querydb/studentcourse",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        data: new FormData(this)
    });
    request.done(function (result) {
        if(result === 'false'){
            displayFeedback('No record found!', true)
            queryresult[7].innerHTML = "";
            enableButton('.querybtn');
        }else{
            displayFeedback(`${result.rowsInserted} record(s) found!`, false)
            queryresult[7].innerHTML = result.output;
            enableButton('.querybtn');
        }
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
        enableButton('.querybtn');
    });
}));
//--------------------- End 'View Course' ------------------------

//--------------- End Student Profile Page ------------------
//#########################################################