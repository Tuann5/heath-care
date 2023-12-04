const sm_width = 576;
const md_width = 768;
const lg_width = 992;
const xl_width = 1200;

$(document).ready(function(){
    handleScroll();
});

window.addEventListener("scroll", handleScroll);
window.addEventListener("resize", handleScroll);

function handleScroll() {
    var topNav = document.querySelector(".top-nav");
    var mainNav = document.querySelector(".main-nav");
    var mediaQuery = window.matchMedia("(min-width: 768px)");

    if (mediaQuery.matches) {
        if (window.scrollY > topNav.clientHeight) {
            topNav.classList.remove("active");
            mainNav.classList.add("fixed-top");
        } else {
            topNav.classList.add("active");
            mainNav.classList.remove("fixed-top");
        }
    } else {
        topNav.classList.remove("active");
        mainNav.classList.add("fixed-top");
    }
}