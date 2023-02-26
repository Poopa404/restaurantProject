// When the user scrolls the page, execute myFunction
window.onscroll = function() {scrollFunction()};

// Get the navbar
var navbar = document.querySelector("nav");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function scrollFunction() {
  if (window.scrollY > sticky) {
    navbar.classList.add("fixed")
  } else {
    navbar.classList.remove("fixed");
  }
}