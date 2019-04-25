// index page div
var signupmodal = document.getElementById('signupModal');
var loginmodal = document.getElementById('loginModal');
var ul = document.getElementsByClassName("nav-ul-right")[0];
// index page button
var signupbtn  = document.getElementById("signupBtn");
var loginbtn  = document.getElementById("loginBtn");
var btnlogin = document.getElementById("myBtnlogin");
var btnsignup = document.getElementById("myBtnsignup");
// navbar button
var navloginbtn  = document.getElementById("navloginBtn");
// modal close span
var closesignupSpan = document.getElementById("closeSignup");
var closeloginSpan = document.getElementById("closeLogin");
// show navbar 
var shownavBtn = document.getElementById("showNav");

// show navbar
shownavBtn.onclick = function() {
    ul.classList.toggle("hidden");
};
// ----------------------------------
signupbtn.onclick = function() {
    signupmodal.style.display = "flex";  
};
btnsignup.onclick = function() {
    signupmodal.style.display = "flex";
    loginmodal.style.display = "none";
};
closesignupSpan.onclick = function() {
    signupmodal.style.display = "none";  
};
// user login
btnlogin.onclick = function() {
    loginmodal.style.display = "flex"; 
    signupmodal.style.display = "none";
};
loginbtn.onclick = function() {
    loginmodal.style.display = "flex";  
};
closeloginSpan.onclick = function() {
    loginmodal.style.display = "none";  
};
// navigation buttons
navloginbtn.onclick = function() {
    loginmodal.style.display = "flex";
    ul.classList.toggle("hidden");  
};
// window events
window.onclick = function(event) {
    if (event.target == signupmodal) {
        signupmodal.style.display = "none";
    }else if(event.target == loginmodal){
        loginmodal.style.display = "none";
    }
};