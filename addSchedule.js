document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = './login.html';
        return;
    }

});


function showScheduleContainer() {
    var scheduleNameInput = document.getElementById("scheduleName");
    var rowCountInput = document.getElementById("rowCount");
    var scheduleContainer = document.getElementById("scheduleContainer");

    if (scheduleNameInput.value.trim() !== "" && rowCountInput.checkValidity() && rowCountInput.value >= 1 && rowCountInput.value <= 8) {
    document.getElementById("scheduleNameDisplay").innerText = scheduleNameInput.value;
    document.querySelector(".schedule-name-input").style.display = "none";
    scheduleContainer.style.display = "flex";

    // Remove existing schedule entries
    var scheduleEntries = document.querySelectorAll(".schedule-entry");
    scheduleEntries.forEach(entry => entry.remove());

    // Add new schedule entries based on the row count
    for (let i = 0; i < rowCountInput.value; i++) {
    addScheduleEntry();
}
}
}

    function addScheduleEntry() {
    var scheduleEntryContainer = document.querySelector(".schedule-container");

    var scheduleEntry = document.createElement("div");
    scheduleEntry.classList.add("schedule-entry");

    var timeStartInput = document.createElement("input");
    timeStartInput.type = "time";
    timeStartInput.placeholder = "Час кінця";

    var timeEndInput = document.createElement("input");
    timeEndInput.type = "time";
    timeEndInput.placeholder = "Час початку";

    var disciplineInput = document.createElement("input");
    disciplineInput.type = "text";
    disciplineInput.placeholder = "Назва";

    scheduleEntry.appendChild(timeStartInput);
    scheduleEntry.appendChild(timeEndInput);
    scheduleEntry.appendChild(disciplineInput);

    scheduleEntryContainer.appendChild(scheduleEntry);
}

    function addSchedule() {
    var scheduleNameDisplay = document.getElementById("scheduleNameDisplay").innerText;
    var scheduleEntries = document.querySelectorAll(".schedule-entry");

    var scheduleData = [];

    scheduleEntries.forEach(entry => {
    var timeStart = entry.querySelector("input:nth-child(1)").value;
    var timeEnd = entry.querySelector("input:nth-child(2)").value;
    var discipline = entry.querySelector("input:nth-child(3)").value;

    scheduleData.push({ timeStart, timeEnd, discipline });
});

    // Отправка данных на сервер
    fetch('http://localhost:3000/schedule/addSchedule', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
},
    body: JSON.stringify({ scheduleName: scheduleNameDisplay, scheduleData: scheduleData }),
})
    .then(response => response.json())
    .then(data => {
    console.log(data);
    showNotification(data.message, 'notification');
})
    .catch((error) => {
    console.error('Error:', error);
    showNotification('Помилка при додаванні розкладу', 'error-notification');
});
}

    function showNotification(message, className) {
    var notification = document.createElement('div');
    notification.className = className;
    notification.innerHTML = message;

    document.body.appendChild(notification);

    // Показать уведомление в течение 3 секунд
    setTimeout(function () {
    document.body.removeChild(notification);
}, 3000);
}