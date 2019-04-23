// admin dashboard modal
var applicationLoan = document.getElementById('application');
var verifyUser = document.getElementById('verification');
// dashboard buttons
var newLoans = document.getElementById("newLoans");
var userVerification = document.getElementById("userVerification");

newLoans.onclick = function () {
    applicationLoan.style.display ="flex";
    verifyUser.style.display = "none";
};

userVerification.onclick = function () {
    applicationLoan.style.display ="none";
    verifyUser.style.display = "flex";
};