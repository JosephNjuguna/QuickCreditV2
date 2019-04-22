//userprofile div
var userModal = document.getElementById('userdata');
var payloanModal = document.getElementById('payloan');
var historyModal = document.getElementById('history');
// navbar button
var navProfileBtn = document.getElementById("navProfilebtn");
var navpayloanBtn = document.getElementById("navpayLoanbtn");
var navhistoryBtn = document.getElementById("navHistorybtn");
// close modal button
var span = document.getElementById("payloanModal")
// navigation buttons userprofile
navProfileBtn.onclick= function(){
    userModal.style.display = "flex";
    historyModal.style.display ="none";
};

navpayloanBtn.onclick= function(){
    userModal.style.display = "flex";
    payloanModal.style.display = "flex";
    historyModal.style.display ="none"; 
};

navhistoryBtn.onclick = function () {
    userModal.style.display = "none";
    historyModal.style.display ="flex";
};

span.onclick = function() {
    payloanModal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == payloanModal) {
        payloanModal.style.display = "none";
    }
};