//--------------    For the modal box   ---------------------//
var isModal = false;
// true if the modalbox is shown and false if not
var currentModal = "";
var clicked_section = "";
var modal_close = document.getElementsByClassName("modal_close");
var smsclick = document.querySelectorAll(".showmodal_sms");
var feedbacks = document.querySelectorAll(".feedback");
var queryresults = document.querySelectorAll('.queryresult');
addEventListener('click', doTask);
function doTask(e){
//This shows the modal boxes...
    var classes = e.target['classList'];
    console.log(classes);
    var modalboxes = ['sms_modal','viewstudent_modal','viewcollege_modal', 'viewprogram_modal',
                    'viewcourse_modal','viewdepartment_modal','addnewexamhall_modal','viewexamhall_modal',
                    'uploadcourselist_modal','uploadresult_modal','addcourse_modal', 'addprogram_modal',
                    'addcollege_modal','adddept_modal', 'viewuploadedresult_modal','uploadstudent_modal', 
                    'std_viewcourselist_modal','setvalue_modal', 'setconstraints_modal','setexamdd_modal',
                'viewtimetable_modal','std_viewtimetable_modal','generatetimetable_modal','std_viewcourseresult_modal'];
    var presentClasses = [];
    for (var i = 0; i < classes.length; i++) {
        presentClasses.push(classes[i]);
    }
//This is for displaying a modalbox
    for (var modalbox of modalboxes) {
        if (presentClasses.indexOf(modalbox) !== - 1){
            currentModal = document.getElementById(modalbox);
            currentModal.style.display = "block";
            isModal = true;
            currentModal = modalbox;
            break;
        }
    }
//This is for hiding the opened modal. Be it the sms or view
    if (e.target['className'] === "modal_close"){
        currentModal = document.getElementById(currentModal);
        currentModal.style.display = "none";
        // Or used this:    e.target.parentNode.parentNode.parentNode.style.display = "none";
        isModal = false;
        closeAllFeedbacks();
    }
    
//This sets the heading to the selected option
    if (e.target['className'] === "qSection_a"){
        option_heading.innerHTML = e.target['innerText'];
        //----- Highlight the selected option ----- //
        if(clicked_section){
            clicked_section.classList.remove('active_section');
        }
        e.target.parentNode.classList.add('active_section');
        clicked_section = e.target.parentNode;
    }

//------- For the closing of the feed back notification ---------
    if (e.target['className'] === "feedback_close"){
        for(let feedback of feedbacks){
            feedback.classList.add('display_none');
        }
    }
}
    //-------- This closes the ALL feedbacks when the opened modal is closed --------
    function closeAllFeedbacks(){
        for(let feedback of feedbacks){
        feedback.classList.add('display_none');
        }
        for(let queryresult of queryresults){
            queryresult.innerHTML = "";
        }
    }
//------------------------ End for feedbacks ------------------------------
