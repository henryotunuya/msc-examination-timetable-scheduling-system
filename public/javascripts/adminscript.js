var mgntl = document.getElementsByClassName('mgntask_list');
var quicklink = document.querySelector('.qSection-link');

quicklink.addEventListener('click', displayTask);
function displayTask(e) {
    for (var i = 0; i < mgntl.length; i++) {
        //Firstly, set the display style property of all the items to 'flex'
        mgntl[i].style.display = 'flex';
        //...and now hide the other elements that were NOT! clicked leaving only the clicked one
        if (mgntl[i].getAttribute('id') !== e.target['name']) {
            mgntl[i].style.display = 'none'
        }
    }
    mgntask_list_wrapper.style.display = 'block';
}
/*	Working with the option_heading	*/
function setOptionHeader(e) {
    if (e.target['className'] === "qSection_a") {
        option_heading.innerHTML = e.target['innerText'];
    }
}