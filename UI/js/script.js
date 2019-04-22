// index page div
var signupmodal = document.getElementById('signupModal');
var loginmodal = document.getElementById('loginModal');
// index page button
var signupbtn  = document.getElementById("signupBtn");
var loginbtn  = document.getElementById("loginBtn");
// navbar button
var navloginbtn  = document.getElementById("navloginBtn");
// modal close span
var closesignupSpan = document.getElementById("closeSignup");
var closeloginSpan = document.getElementById("closeLogin");

signupbtn.onclick = function() {
    signupmodal.style.display = "flex";  
};
closesignupSpan.onclick = function() {
    signupmodal.style.display = "none";  
};
// user login
loginbtn.onclick = function() {
    loginmodal.style.display = "flex";  
};
closeloginSpan.onclick = function() {
    loginmodal.style.display = "none";  
};
// navigation buttons
navloginbtn.onclick = function() {
    loginmodal.style.display = "flex";  
};
// window events
window.onclick = function(event) {
    if (event.target == signupmodal) {
        signupmodal.style.display = "none";
    }else if(event.target == loginmodal){
        loginmodal.style.display = "none";
    }
};