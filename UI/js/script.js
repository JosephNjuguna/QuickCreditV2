// div
var signupmodal = document.getElementById('signupModal');
// button
var signupbtn  = document.getElementById("signupBtn");
// modal close span
var closesignupSpan = document.getElementsByClassName("close")[0];

signupbtn.onclick = function() {
    signupmodal.style.display = "flex";  
};

closesignupSpan.onclick = function() {
    signupmodal.style.display = "none";  
};

window.onclick = function(event) {
    if (event.target == signupmodal) {
        signupmodal.style.display = "none";
    }
};