
//-------------------This is for the slides--------------------------

var slides = document.getElementsByClassName('slide');
var current = document.getElementById('current');
var total = document.getElementById('total');
var preSlide = document.getElementById('preSlide');
var nxtSlide = document.getElementById('nxtSlide');
var i = 0;
var slidesLength = slides.length;
total.textContent = slidesLength;

preSlide.addEventListener('click', function () {
    i--;
    var c = i;
    downSlide(c);

});
nxtSlide.addEventListener('click', function () {
    i++;
    var c = i;
    upSlide(c);

});
// Display the 1st slide
slides[i].classList.toggle('topSlide');
current.textContent = i + 1;
setInterval(tranverseSlide, 5000); //call the next slide after 5secs
function tranverseSlide() {
    if (i < slidesLength - 1) {
        /*Hide the current slide and then show the next one*/
        console.log(i);
        slides[i].classList.toggle('topSlide');
        slides[i + 1].classList.toggle('topSlide');
        i++;
        current.textContent = i + 1;
    } else {
        /*End of slide then start over again.
         First hide the current slide, set index = 0 then display first slide.
         Then increment the index by 1			*/
        console.log("sss" + i);
        slides[i].classList.toggle('topSlide');
        i = 0;
        slides[i].classList.toggle('topSlide');
        current.textContent = i + 1;
    }
}
function upSlide(c) {
    if (c < slidesLength) {
        slides[c - 1].classList.toggle('topSlide');
        slides[c].classList.toggle('topSlide');
        current.textContent = i + 1;
        console.log(c);
    } else {
        i = 0;
        slides[c - 1].classList.toggle('topSlide');
        slides[i].classList.toggle('topSlide');
        current.textContent = i + 1;
        console.log("Here" + c);
    }
}
function downSlide(c) {
    if (c >= 0) {
        slides[c].classList.toggle('topSlide');
        slides[c + 1].classList.toggle('topSlide');
        current.textContent = i + 1;
        console.log(c);
    } else {
        i = slidesLength - 1;
        slides[i].classList.toggle('topSlide');
        slides[c + 1].classList.toggle('topSlide');
        current.textContent = i + 1;
        console.log("Here2" + c);
    }
}

//----------------------- End Slideshow --------------------------------