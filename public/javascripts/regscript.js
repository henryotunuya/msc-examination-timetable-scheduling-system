var index = 0;
var subjectbox = document.getElementById('subjectbox');
var newsubjectbox = document.querySelector('.sb');
//var newsubject = allnewsubject[0];
var subject = document.getElementById('subjectbox');
//-- Now refresh the list in the 'add subject' modal box
var table1 = 'subjects';
var table2; //Not used. It's here just to suppress the reference error
var inputelement = document.getElementById('subjectsvalue'); // to read the input value
var outputelement = document.getElementById('subjecttoteach'); // to hold the output result
var datalistStore = {table1:datalist, table2:datalist};

var datalist;
setTimeout(function(){
   // datalist = ajaxGetDbRows(datalistStore,inputelement,table1,table2,outputelement);
},1000);
//alert(datalist);

//subject.innerHTML = datalist;
var btnaddsubject = document.getElementById('btnaddsubject');
if(btnaddsubject){
    subject = subject.innerHTML;
    btnaddsubject.addEventListener('click', addSubject);
    btnremovesubject.addEventListener('click', removeSubject);
}
function addSubject(){
    var newsubjectbox = document.querySelector('.sb');
    //subjectbox.appendChild(newsubjectbox);
    newsubjectbox.classList.remove('sb');
    newsubjectbox.innerHTML = subject;
    //subjectbox.removeChild(subjectbox[index]);
    //index++;
    var subjectbox = document.getElementById('subjectbox');
    console.log(subjectbox);
}

function removeSubject(){
    var subjectbox = document.querySelector('#subjectbox');
    var subjects = document.querySelectorAll('.subject');
    var lastindex = subjects.length-1;
    var lastsubject = subjects[lastindex];
    console.log(lastsubject);
    console.log(lastindex);
    subjectbox.removeChild(lastsubject);    
}

//----- This is for the 'Edit' buttons in the edit page ----------
    addEventListener('click', showField);
    function showField(e){
        //-- If the button clicked is 'Edit' then change it to 'Unedit'
        //  and then display the edit field
        if (e.target['innerText'] === 'Edit'){
            e.target['innerText'] = 'Unedit';
            e.target.parentNode.nextSibling.style.display = 'block';
            
         //-- Else if the button clicked is 'Unedit' then change it to 'Edit'
        //  and then undisplay the edit field   
        }else if(e.target['innerText'] === 'Unedit' ){
            e.target['innerText'] = 'Edit';
            e.target.parentNode.nextSibling.style.display = 'none';
        }
    }
//----------------------- END Edit button code ----------------------

//-------- Controls the field colour change in the 'edit page' ----------
    addEventListener('keyup', colourField);
    function colourField(e){
        if(e.target.parentNode.previousSibling.lastChild.innerText === 'Unedit'){
            var mainfield = e.target.parentNode.previousElementSibling.firstElementChild.nextSibling.nextElementSibling.classList;
            if(e.target.value.length > 0){
                e.target.classList.add('unalteredfield');
                mainfield.remove('unalteredfield');
                mainfield.add('alteredfield');                
            }else if(e.target.value.length === 0){
                e.target.classList.remove('unalteredfield');
                mainfield.remove('alteredfield');
                mainfield.add('unalteredfield');
            }
        }
    }
//-------------- END field colour change --------------------

