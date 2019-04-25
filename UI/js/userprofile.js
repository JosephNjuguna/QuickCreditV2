//userprofile div
var userModal = document.getElementById('userdata');
var payloanModal = document.getElementById('payloan');
var historyModal = document.getElementById('history');
var ul = document.getElementsByClassName("nav-ul-right")[0];

// navbar button
var navProfileBtn = document.getElementById("navProfilebtn");
var navpayloanBtn = document.getElementById("navpayLoanbtn");
var navhistoryBtn = document.getElementById("navHistorybtn");
// close modal button
var span = document.getElementById("payloanModal");
// show navbar 
var shownavBtn = document.getElementById("showNav");

// show navbar
shownavBtn.onclick = function() {
    ul.classList.toggle("hidden");
};
// navigation buttons userprofile
navProfileBtn.onclick= function(){
    userModal.style.display = "flex";
    historyModal.style.display ="none";
    ul.classList.toggle("hidden");
};

navpayloanBtn.onclick= function(){
    userModal.style.display = "flex";
    payloanModal.style.display = "flex";
    historyModal.style.display ="none"; 
    ul.classList.toggle("hidden");
};

navhistoryBtn.onclick = function () {
    userModal.style.display = "none";
    historyModal.style.display ="flex";
    ul.classList.toggle("hidden");
};

span.onclick = function() {
    payloanModal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == payloanModal) {
        payloanModal.style.display = "none";
    }
};