// When the user scrolls the page, execute myFunction
window.onscroll = function() {scrollFunction()};

// Get the navbar
var navbar = document.querySelector("#mainMenuNavbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function scrollFunction() {
  if (window.scrollY > sticky) {
    navbar.classList.remove("absolute")
    navbar.classList.remove("bg-transparent")
    navbar.classList.add("bg-sweed-gray")
    navbar.classList.add("fixed")
    navbar.classList.add("border-b-2")
  } else {
    navbar.classList.add("absolute")
    navbar.classList.add("bg-transparent")
    navbar.classList.remove("bg-gray")
    navbar.classList.remove("fixed")
    navbar.classList.remove("border-b-2")
  }
}