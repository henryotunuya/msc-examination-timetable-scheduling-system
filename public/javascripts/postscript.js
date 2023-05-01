
var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}], // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}], // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}], // outdent/indent
    [{'direction': 'rtl'}], // text direction
    [{'size': ['small', false, 'large', 'huge']}], // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}], // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link'],
    ['image'],
    ['video'],
    ['formula']
];

var quill = new Quill('#news-container', {
    modules: {
        toolbar: toolbarOptions
    },
    placeholder: 'Compose an epic...',
    theme: 'snow',
    readOnly: false
});

var data = document.getElementById('content');
var postheadline = document.getElementById('postheadline');

function getData(){
    var delta = quill.getContents();
    data.value = JSON.stringify(delta);
    console.log(data.value);
    console.log("_________", quill.root.innerHTML);
    return data.value;
}

var formaddpost = document.getElementById('formaddpost');
formaddpost.addEventListener('submit', function(e){
    e.preventDefault();
    //uploadbutton.attr('disabled', 'disabled');
    var postheadline = postheadline.value;
    var postcontent = getData();
    var request = $.ajax({
        url: "/staff/admin/post/addpost",
        contentType: false,
        method: "POST",
        cache: false,
        processData: false,
        datatype: 'json',
        data: {'postheading':postheading,'postcontent':postcontent}
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
            displayFeedback("This result has been uploaded already!", true);
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
});