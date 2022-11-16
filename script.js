// stack overflow thread concerning smooth scroll issues in safari
// https://stackoverflow.com/questions/56011205/is-there-a-safari-equivalent-for-scroll-behavior-smooth

// ------ Overall Variables ------ //
const carousel = document.querySelector(".carousel");

let duration = 12000;
let animation = undefined;
let endPos = undefined;
let timeout = undefined;
let overflown = false;

const options = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        moveX();
    });
}, options);

initSlider();


window.addEventListener("resize", () => {
    initSlider();

    if (animation) {
        animation.cancel();
        animation = undefined;

        if (overflown) {
            timeout = setTimeout(moveX, 1000);
        }  
    } 

    if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
        if (overflown) {
            timeout = setTimeout(moveX, 1000);
        }
    }
});

function initSlider() {
    const copiedSlides = document.getElementsByClassName("copy");
    if (copiedSlides) {
        Array.from(copiedSlides).forEach(slide => {
            slide.remove();
        });
    }
    const slides = document.getElementsByClassName("slide");
    const gap = parseInt(getComputedStyle(slides[1]).getPropertyValue("--gap")) * 16; // rem
    endPos = carousel.scrollWidth + gap;
    overflown = isOverflown(carousel);

    if (isOverflown(carousel)) {
        observer.observe(carousel);

        Array.from(slides).forEach(slide => {
            const newNode = slide.cloneNode(true);
            newNode.classList.add("copy");
            carousel.appendChild(newNode);
        });
    }
}

carousel.addEventListener("mouseenter", () => {
    if (animation) {
        animation.pause();
    }
});

carousel.addEventListener("mouseleave", () => {
    if (animation) {
        animation.play();
    }
});

// ------ Utility Functions ------ //
function isOverflown(element) {
    return element.clientWidth < element.scrollWidth || element.clientHeight < element.scrollHeight;
}

function moveX() {
    if (!animation) {
        animation = carousel.animate(
            [
                { transform: `translateX(-${0}px)` },
                { transform: `translateX(-${endPos}px)` }
            ], 
            { 
                duration: duration, 
                iterations: Infinity,
                fill: "forwards",
            }
        );
    }
}

function getPosX(element) {
    return Math.abs(new WebKitCSSMatrix(window.getComputedStyle(element).transform).m41);
}