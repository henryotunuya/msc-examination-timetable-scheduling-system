var dataexists = document.getElementById('dataexists');

//-------------- This is for the 'parentdatasection' div ---------------
document.body.onload = function () {
    //---- This is executed the moment the page is loaded
    //---- This is because the 'dataexists' checkbox is checked by default
    if (dataexists) {
        disableParentdatasection();
    }
    var table1;
    var table2;
    var outputelement;
    var inputfield;
    var fields = ['departmentcollegeids', 'nokorstaff', 'classesvalue', 'subjectsvalue', ''];
    for (let field of fields) {
        field = document.getElementById(field);
        if (field) {
            inputfield = field;
        }
    }
    if (inputfield) {
        switch (inputfield.value) {
            case 'college':
                table1 = 'college';
                outputelement = departmentcollegeids;
                break;
            case 'nextofkin':
                table1 = 'nextofkin';
                table2 = 'staff';
                outputelement = ids;
                break;
            case 'classes':
                table1 = 'class';
                outputelement = classes;
                break;
            case 'subjects':
                table1 = 'subject';
                outputelement = subjecttoteach;
                break;
        }
        var datalistStore = { table1: datalist, table2: datalist };
        ajaxGetDbRows(datalistStore, inputfield, table1, table2, outputelement); 
        //^^ This is defined in 'asynccalls.js' file
    }
}

if (dataexists) {
    dataexists.addEventListener('change', function () {
        if ((dataexists.checked)) {
            disableParentdatasection();
        } else {
            enableParentdatasection();
        }
    });
}
var pds;
var pdsHTML = "";
var des = "";
function disableParentdatasection() {
    //------DISABLES all the elements inside the 'datasection' container--------
    pds = datasection.getElementsByClassName('fortheds');
    pdsHTML = datasection.innerHTML;
    dataexistssection.classList.remove('display_none'); //.innerHTML = desHTML;
    for (i = 0; i < pds.length; i++) {
        pds[i].setAttribute('disabled', 'disabled');
    }
}
function enableParentdatasection() {
    //------ENABLES all the elements inside the 'datasection' container by putting back its original content--------
    pds = datasection.getElementsByClassName('fortheds');
    datasection.innerHTML = pdsHTML;
    console.log(pdsHTML);
    dataexistssection.classList.add('display_none');
}
//-------------------------End 'parentdatasection'-------------------------------

//----------------------- For Passport preview ---------------------------------
var passport = document.getElementById('passport');
if (passport) {
    passport.addEventListener('change', displayPassport);
}
function displayPassport() {
    // $("#passport").change(function () {
    //   $("#message").empty(); // To remove the previous error message
    var file = this.files[0];
    if (file) {
        var imagefile = file.type;
        var match = ["image/jpeg", "image/png", "image/jpg"];
        if (!((imagefile == match[0]) || (imagefile == match[1]) || (imagefile == match[2]))) {
            passportthumbnail.setAttribute('src', '/images/passportdummy.png');
            //     $("#message").html("<p id='error'>Please Select A valid Image File</p>" + "<h4>Note</h4>" + "<span id='error_message'>Only jpeg, jpg and png Images type allowed</span>");
            return false;
        } else {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    } else {
        passportthumbnail.setAttribute('src', '/images/passportdummy.png');
    }
    //  });
    function imageIsLoaded(e) {
        passportthumbnail.setAttribute('src', e.target.result);
        passportthumbnail.setAttribute('width', '170px');
        passportthumbnail.setAttribute('height', '150px');
    };
}
//------------------------ End passport preview --------------------------------