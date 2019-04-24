// admin dashboard modal
var applicationLoan = document.getElementById('application');
var verifyUser = document.getElementById('verification');
var repaidLoans = document.getElementById('repaid');
var currentLoans = document.getElementById('current');
// dashboard buttons
var newLoans = document.getElementById("newLoans");
var userVerification = document.getElementById("userVerification");
var loanRepaid = document.getElementById("repaidLoan");
var notPaidloan = document.getElementById("notPaidloan");

newLoans.onclick = function () {
    applicationLoan.style.display ="flex";
    verifyUser.style.display = "none";
    repaidLoans.style.display ="none";
    currentLoans.style.display = "none";
};

userVerification.onclick = function () {
    applicationLoan.style.display ="none";
    verifyUser.style.display = "flex";
    repaidLoans.style.display ="none";
    currentLoans.style.display = "none";
};

loanRepaid.onclick = function () {
    applicationLoan.style.display ="none";
    verifyUser.style.display = "none";
    repaidLoans.style.display ="flex";
    currentLoans.style.display = "none";
};

notPaidloan.onclick = function () {
    applicationLoan.style.display ="none";
    verifyUser.style.display = "none";
    repaidLoans.style.display ="none";
    currentLoans.style.display = "flex";
};