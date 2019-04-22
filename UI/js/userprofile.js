//userprofile div
var userModal = document.getElementById('userdata');
var historyModal = document.getElementById('history');
// navbar button
var navProfileBtn = document.getElementById("navProfilebtn");
var navhistoryBtn = document.getElementById("navHistorybtn");
// navigation buttons userprofile
navProfileBtn.onclick= function(){
    userModal.style.display = "flex";
    historyModal.style.display ="none";
};

navhistoryBtn.onclick = function () {
    userModal.style.display = "none";
    historyModal.style.display ="flex";
};