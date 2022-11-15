// stack overflow thread concerning smooth scroll issues in safari
// https://stackoverflow.com/questions/56011205/is-there-a-safari-equivalent-for-scroll-behavior-smooth

// ------ Overall Variables ------ //
const carousel = document.querySelector(".carousel");

const options = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        startAutoplay();
    });
}, options);

let interval;
let currentPos;
let endPos

if (isOverflown(carousel)) {
    observer.observe(carousel);
}

window.addEventListener("resize", () => {
    carousel.scrollLeft = 0;

    if (isOverflown(carousel)) {
        observer.observe(carousel);
    }

    // when changing to a bigger screen, it will still cycle because the slides have already been doubled
});

function startAutoplay() {
    const slides = document.getElementsByClassName("slide");
    endPos = carousel.scrollWidth + 16;

    Array.from(slides).forEach(slide => {
        carousel.appendChild(slide.cloneNode(true));
    });

    currentPos = carousel.scrollLeft;
    interval = setInterval(frame, 20);  
}

function frame() {
    currentPos += 0.5;
    carousel.scrollLeft = currentPos;
    if (currentPos === endPos) {
        carousel.scrollLeft = 0;
        currentPos = 0;
    };
}  

// ------ Drag Function ------ //
let isDragging = false;
let startMousePos = 0;
let startScrollLeft = 0;

carousel.addEventListener("mousedown", handleStartDrag);
carousel.addEventListener("touchstart", handleStartDrag);

carousel.addEventListener("mousemove", handleMoveDrag);
carousel.addEventListener("touchmove", handleMoveDrag);

carousel.addEventListener("mouseup", handleStopDrag);
carousel.addEventListener("touchend", handleStopDrag);

function handleStartDrag(event) {
    if (event.cancelable) {
        event.preventDefault();
        isDragging = true;
        clearInterval(interval);
        interval = null;
        // check if mouse or touch event
        startMousePos = event.pageX ? event.pageX : event.changedTouches[0].pageX;
        startScrollLeft = carousel.scrollLeft;
    }
}

function handleMoveDrag(event) {
    // event.preventDefault();
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft + startMousePos - (event.pageX ? event.pageX : event.changedTouches[0].pageX);
}

function handleStopDrag(event) {
    // event.preventDefault();
    if (!isDragging) return;
    isDragging = false;
    currentPos = carousel.scrollLeft;
    interval = setInterval(frame, 20);
}

// ------ Utility Functions ------ //
function isOverflown(element) {
    return element.clientWidth < element.scrollWidth || element.clientHeight < element.scrollHeight;
}