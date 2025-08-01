// SETS FOR LIGHTS
let currentLang = 'hu';  // Default language
let timeh1,timeAgo1;
let timeh2,timeAgo2;
let timeh3,timeAgo3;
let timeh4,timeAgo4;
let globalState;
const texts = {
    en: {
        controlTitle: "Lights Control",
        windowTitle: "Window Control",
        intTitle: "Light Intensity",
        lightOpen: ["Hall 1", "Hall 2", "Hall 3", "Warehouse"],
        hallOpen: ["Open Hall 1", "Open Hall 2", "Open Hall 3", "Open Warehouse"],
        hallClose: ["Close Hall 1", "Close Hall 2", "Close Hall 3", "Close Warehouse"],
        statusActive: "",
        statusInactive: "Is not active",
        statusWindowOpened: "Now opened",
        statusWindowClosed: "Now closed",
        setDefault: "Set default",
        allWindowsOpened: "All windows are opened currently",
        allWindowsClosed: "All windows are closed currently",
        relay1On: "Relay 1 automatic is now turned on",
        relay1Off: "Relay 1 automatic is now turned off",
        relay2On: "Relay 2 automatic is now turned on",
        relay2Off: "Relay 2 automatic is now turned off",
        relay3On: "Relay 3 automatic is now turned on",
        relay3Off: "Relay 3 automatic is now turned off",
        relay4On: "Relay 4 automatic is now turned on",
        relay4Off: "Relay 4 automatic is now turned off",
        mixedWindowsState: 'Some windows may be opened/closed',
        processing: "Processing",
        minutes: "minutes ago",
        hours: "hours ago",
        days: "days ago",
        auto: "Automatic mode",
        manual: "Manual Mode",
        submitButton: "Submit",
        cancelButton: "Cancel"
    },
    sk: {
        controlTitle: "Ovládanie Svetiel",
        windowTitle: "Ovládanie Okien",
        intTitle: "Intenzita Svetla",
        lightOpen: ["Hala 1", "Hala 2", "Hala 3", "Sklad"],
        hallOpen: ["Otvoriť Halu 1", "Otvoriť Halu 2", "Otvoriť Halu 3", "Otvoriť Sklad"],
        hallClose: ["Zatvoriť Halu 1", "Zatvoriť Halu 2", "Zatvoriť Halu 3", "Zatvoriť Sklad"],
        statusActive: "",
        statusInactive: "Neaktívne",
        statusWindowOpened: "Práve sú otvorené",
        statusWindowClosed: "Práve sú zatvorené",
        setDefault: "Nastaviť predvolené",
        allWindowsOpened: "Práve teraz sú otvorené všetky okná",
        allWindowsClosed: "Práve teraz sú zatvorené všetky okná",
        relay1On: "Automatické otváranie v hale 1 je teraz zapnuté",
        relay1Off: "Automatické otváranie v hale 1 je teraz vypnuté",
        relay2On: "Automatické otváranie v hale 2 je teraz zapnuté",
        relay2Off: "Automatické otváranie v hale 2 je teraz vypnuté",
        relay3On: "Automatické otváranie v hale 3 je teraz zapnuté",
        relay3Off: "Automatické otváranie v hale 3 je teraz vypnuté",
        relay4On: "Automatické otváranie v sklade je teraz zapnuté",
        relay4Off: "Automatické otváranie v sklade je teraz vypnuté",
        mixedWindowsState: 'Niektoré okno je otvorené/zatvorené',
        processing: "Nastavujem",
        minutes: "minútami",
        hours: "hodinami",
        days: "dňami",
        auto: "Automatický mód",
        manual: "Manuálny mód",
        submitButton: "Nastaviť",
        cancelButton: "Zrušiť"
    },
    hu: {
        controlTitle: "Lámpa Vezérlés",
        windowTitle: "Ablak Vezérlés",
        intTitle: "Lámpa Fényerő Beállítás",
        lightOpen: ["1. Csarnok", "2. Csarnok", "3. Csarnok", "Raktár"],
        hallOpen: ["Nyitás 1. Csarnok", "Nyitás 2. Csarnok", "Nyitás 3. Csarnok", "Nyitás Raktár"],
        hallClose: ["Zárás 1. Csarnok", "Zárás 2. Csarnok", "Zárás 3. Csarnok", "Zárás Raktár"],
        statusActive: "",
        statusInactive: "Inaktív",
        statusWindowOpened: "Most nyitva van",
        statusWindowClosed: "Most zárva van",
        setDefault: "Alapértelmezett beállítása",
        allWindowsOpened: "Jelenleg minden ablak nyitva van",
        allWindowsClosed: "Jelenleg minden ablak zárva van",
        relay1On: "A 1. hala ablak automatikája most be van kapcsolva",
        relay1Off: "A 1. hala ablak automatikája most ki van kapcsolva",
        relay2On: "A 2. hala ablak automatikája most be van kapcsolva",
        relay2Off: "A 2. hala ablak automatikája most ki van kapcsolva",
        relay3On: "A 3. hala ablak automatikája most be van kapcsolva",
        relay3Off: "A 3. hala ablak automatikája most ki van kapcsolva",
        relay4On: "A 4. hala ablak automatikája most be van kapcsolva",
        relay4Off: "A 4. hala ablak automatikája most ki van kapcsolva",
        mixedWindowsState: 'Néhány ablak nyitva/zárva van',
        processing: "Állítom",
        minutes: "perce",
        hours: "órája",
        days: "napja",
        auto: "Automata mód",
        manual: "Manuális mód",
        submitButton: "Allítani",
        cancelButton: "Mégse"
    }
};

function setTimeUpdatedAgo() {
    let currenttime;

    fetch('/get-time')
        .then(response => response.json())
        .then(data => {
            currenttime = new Date(data.message);

            let timeh1Date = new Date(timeh1);
            let timeh2Date = new Date(timeh2);
            let timeh3Date = new Date(timeh3);
            let timeh4Date = new Date(timeh4);

            // Calculate timeAgo in minutes for each hall
            let timeAgo1 = Math.floor((currenttime.getTime() - timeh1Date.getTime()) / (1000 * 60));
            let timeAgo2 = Math.floor((currenttime.getTime() - timeh2Date.getTime()) / (1000 * 60));
            let timeAgo3 = Math.floor((currenttime.getTime() - timeh3Date.getTime()) / (1000 * 60));
            let timeAgo4 = Math.floor((currenttime.getTime() - timeh4Date.getTime()) / (1000 * 60));

            // Find the smallest timeAgo
            let smallestTimeAgo = Math.min(timeAgo1, timeAgo2, timeAgo3, timeAgo4);
            let smallestTimeAgoPeriod;

            if (smallestTimeAgo === timeAgo1) {
                smallestTimeAgoPeriod = 'timeAgo1';
            } else if (smallestTimeAgo === timeAgo2) {
                smallestTimeAgoPeriod = 'timeAgo2';
            } else if (smallestTimeAgo === timeAgo3) {
                smallestTimeAgoPeriod = 'timeAgo3';
            } else {
                smallestTimeAgoPeriod = 'timeAgo4';
            }


            // Now we need to check if the period has changed since this smallest time ago
            checkPeriodChange(smallestTimeAgo);
        })
        .catch(error => {
            console.error('Error fetching time:', error);
        });
}
function checkPeriodChange(smallestTimeAgo) {
    let currentPeriod, previousPeriod;

    fetch('/get-time')
        .then(response => response.json())
        .then(data => {
            let currentDate = new Date(data.message);
            let previousDate = new Date(currentDate);

            previousDate.setMinutes(previousDate.getMinutes() - smallestTimeAgo);


            currentPeriod = determinePeriod(currentDate);
            previousPeriod = determinePeriod(previousDate);


            const isDifferentDay = currentDate.getDate() !== previousDate.getDate();
            const isDifferentPeriod = currentPeriod !== previousPeriod;

            if (isDifferentDay || isDifferentPeriod) {
                globalState = true;
            } else {
                globalState = false;
            }
        })
        .catch(error => {
            console.error('Error fetching time:', error);
        });
}


function determinePeriod(date) {
    let day = date.getDay();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let state;

    if ((day === 6 && (hours > 6 || (hours === 6 && minutes > 30))) || day === 0) {
        if ((hours > 20) || (hours === 20 && minutes >= 0) || (hours < 6) || (hours === 6 && minutes <= 30)) {
            state = 'weekend_night';
        } else {
            state = 'weekend';
        }
    } else if ((day === 6 && (hours <= 6 && minutes <= 30)) || (day !== 6 && day !== 0 && ((hours > 22) || (hours === 22 && minutes >= 31) || (hours < 5) || (hours === 5 && minutes <= 30)))) {
        state = 'night';
    } else if (day !== 0 && day !== 6 && ((hours === 5 && minutes >= 31) || (hours > 5 && hours < 14) || (hours === 14 && minutes <= 30))) {
        state = 'morning';
    } else if (day !== 0 && day !== 6 && ((hours === 14 && minutes >= 31) || (hours > 14 && hours < 22) || (hours === 22 && minutes <= 30))) {
        state = 'afternoon';
    }

    return state;
}


setTimeUpdatedAgo();


function sendLightStatus(hall, status, intensity) {
    fetch('/set-lights-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hall: hall, data: status, intensity: intensity })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function checkAllWindowsStatus() {
    const ids = ['hall-1-status-open', 'hall-2-status-open', 'hall-3-status-open', 'hall-4-status-open'];
    const allwinstatus = document.getElementById('allWinStatus');

    // Check if all elements have the 'active' class
    const allActive = ids.every(id => {
        const statusElement = document.getElementById(id);
        return statusElement.classList.contains('active');
    });

    // Check if all elements have the 'inactive' class
    const allClosed = ids.every(id => {
        const statusElement = document.getElementById(id);
        return statusElement.classList.contains('inactive');
    });

    // Check the state and update the message accordingly
    if (allActive) {
        allwinstatus.innerText = texts[currentLang].allWindowsOpened;
        allwinstatus.style.color = 'lightgreen';
    } else if (allClosed) {
        allwinstatus.innerText = texts[currentLang].allWindowsClosed;
        allwinstatus.style.color = 'red';
    } else {
        // Mixed state: some windows are opened, some are closed
        allwinstatus.innerText = texts[currentLang].mixedWindowsState || 'Some windows are open, some are closed.';
        allwinstatus.style.color = 'orange';
    }
}

checkAllWindowsStatus();
setInterval(checkAllWindowsStatus,3000);

function updateWindowsAutoStatus() {

    fetch('/windows-auto-data')
        .then(response => response.text())
        .then(data => {

            // Updated regex to match 4 relays
            const regex = /<AUTO=r1-(on|off);r2-(on|off);r3-(on|off);r4-(on|off)>/;
            const match = data.match(regex);

            if (match) {
                const r1Status = match[1]; // 'on' or 'off' for r1
                const r2Status = match[2]; // 'on' or 'off' for r2
                const r3Status = match[3]; // 'on' or 'off' for r3
                const r4Status = match[4]; // 'on' or 'off' for r4

                // Generating messages for each relay
                const r1Message = texts[currentLang][`relay1${r1Status.charAt(0).toUpperCase() + r1Status.slice(1)}`];
                const r2Message = texts[currentLang][`relay2${r2Status.charAt(0).toUpperCase() + r2Status.slice(1)}`];
                const r3Message = texts[currentLang][`relay3${r3Status.charAt(0).toUpperCase() + r3Status.slice(1)}`];
                const r4Message = texts[currentLang][`relay4${r4Status.charAt(0).toUpperCase() + r4Status.slice(1)}`];

                // Determining colors for each relay based on status
                const r1Color = r1Status === 'on' ? 'lightgreen' : '#FF7F7F';
                const r2Color = r2Status === 'on' ? 'lightgreen' : '#FF7F7F';
                const r3Color = r3Status === 'on' ? 'lightgreen' : '#FF7F7F';
                const r4Color = r4Status === 'on' ? 'lightgreen' : '#FF7F7F';

                // Updating the status element with all 4 relays
                const windowsAutoStatusElement = document.getElementById('windowsAutoStatus');
                windowsAutoStatusElement.innerHTML = `<span style="color: ${r1Color}">${r1Message}.</span><br>
                                                      <span style="color: ${r2Color}">${r2Message}.</span><br>
                                                      <span style="color: ${r3Color}">${r3Message}.</span><br>
                                                      <span style="color: ${r4Color}">${r4Message}.</span>`;
            } else {
                console.error('Data format is incorrect:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching windows auto data:', error);
        });
}

//updateWindowsAutoStatus();
//setInterval(updateWindowsAutoStatus,5000);

function updateStatusA(id, status) {
    const statusElement = document.getElementById(id);

    // Check if it's a window button
    const isWindowButton = ['hall-1-status-open', 'hall-2-status-open', 'hall-3-status-open', 'hall-4-status-open'].includes(id);

    // Determine the status text based on whether it's 'Y' or not
    const statusText = isWindowButton
        ? (status === 'Y' ? texts[currentLang].statusWindowOpened : texts[currentLang].statusWindowClosed)
        : (status === 'Y' ? texts[currentLang].processing : texts[currentLang].statusInactive);

    // Update the element's text content
    statusElement.textContent = statusText;

    // Toggle the 'processing' class based on the status ('Y' means processing)
    statusElement.classList.toggle('processing', status === 'Y');

    // Disable or enable language flags based on the 'processing' state
    if (status === 'Y') {
        //disableFlags();  // Disable flags when processing
    } else {
        //enableFlags();   // Enable flags when not processing
    }
}


// Function to disable language flags by adding the 'flag-disable' class
function disableFlags() {
    const flags = document.querySelectorAll('.flag');
    flags.forEach(flag => {
        flag.classList.add('flag-disable');
    });
}

// Function to enable language flags by removing the 'flag-disable' class
function enableFlags() {
    const flags = document.querySelectorAll('.flag');
    flags.forEach(flag => {
        flag.classList.remove('flag-disable');
    });
}

//setInterval(setTimeUpdatedAgo,5000);

let buttonStatus = {
    'set-1':false,
    'set-2':false,
    'set-3':false,
    'set-4':false
};

document.getElementById('set-def').addEventListener('click', function () {
    let message = 'set-def';
    console.log(message);
    sendToServer(message);
    sendLightStatus(9, true, -1);
    (9, false);
});

//WINDOWS

document.getElementById('hall-1-close').addEventListener('click', function () {
    let message = 'hall-1-close';
    updateStatusA('hall-1-status-open', "Y");
    console.log(message);
    sendToServer(message);
});

document.getElementById('hall-2-close').addEventListener('click', function () {
    let message = 'hall-2-close';
    updateStatusA('hall-2-status-open', "Y");
    console.log(message);
    sendToServer(message);
});

document.getElementById('hall-3-close').addEventListener('click', function () {
    let message = 'hall-3-close';
    updateStatusA('hall-3-status-open', "Y");
    console.log(message);
    sendToServer(message);
});

document.getElementById('hall-4-close').addEventListener('click', function () {
    let message = 'hall-4-close';
    updateStatusA('hall-4-status-open', "Y");
    console.log(message);
    sendToServer(message);
});


document.getElementById('hall-1-open').addEventListener('click', function () {
    let message = 'hall-1-open';
    updateStatusA('hall-1-status-open', "Y");
    console.log(message);
    sendToServer(message);
});

document.getElementById('hall-2-open').addEventListener('click', function () {
    let message = 'hall-2-open';
    updateStatusA('hall-2-status-open', "Y");
    console.log(message);
    sendToServer(message);
});

document.getElementById('hall-3-open').addEventListener('click', function () {
    let message = 'hall-3-open';
    updateStatusA('hall-3-status-open', "Y");
    console.log(message);
    sendToServer(message);
});

document.getElementById('hall-4-open').addEventListener('click', function () {
    let message = 'hall-4-open';
    updateStatusA('hall-4-status-open', "Y");
    console.log(message);
    sendToServer(message);
});


function sendToServer(message, intensity=80) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/lights-set', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ message: message, intensity: intensity}));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };

}
// Counters for each button to track how long they've been processing
let processingCounters = {
    'hall-1-status-open': 0,
    'hall-2-status-open': 0,
    'hall-3-status-open': 0,
    'hall-4-status-open': 0
};

const processingTimeout = 120;  // 2 min

// Function to check processing time for each button
function checkProcessingStatus() {
    const ids = ['hall-1-status-open', 'hall-2-status-open', 'hall-3-status-open', 'hall-4-status-open'];
    let timeAgo = {
        1: timeAgo1,
        2: timeAgo2,
        3: timeAgo3,
        4: timeAgo4
    };
    ids.forEach(id => {
        const statusElement = document.getElementById(id);

        // Check if the element has the 'processing' class
        if (statusElement.classList.contains('processing')) {
            // Increment the counter for the element
            processingCounters[id]++;

            console.log(`${id} has been processing for ${processingCounters[id]} seconds.`);

            // If the counter reaches the timeout, remove 'processing' and set the status
            if (processingCounters[id] >= processingTimeout) {
                statusElement.classList.remove('processing');

                // Check if the element already has 'active' or 'inactive' class
                if (statusElement.classList.contains('active')) {
                    statusElement.textContent = texts[currentLang].statusActive + (globalState ? ' ' + texts[currentLang].auto : ' ' + texts[currentLang].manual);
                    console.log(`Processing for ${id} timed out, but it remains active.`);
                } else if (statusElement.classList.contains('inactive')) {
                    statusElement.textContent = texts[currentLang].statusInactive;
                    console.log(`Processing for ${id} timed out, setting to inactive.`);
                } else {
                    // Default to inactive if neither 'active' nor 'inactive' is present
                    statusElement.classList.add('inactive');
                    statusElement.textContent = texts[currentLang].statusInactive;
                    console.log(`Processing for ${id} took too long, setting to default inactive.`);
                }

                processingCounters[id] = 0;  // Reset the counter
                enableFlags();  // Enable flags after processing timeout
            }
        } else {
            // Reset counter if the element is not in processing
            processingCounters[id] = 0;
        }
    });
}

// Run the check every second
setInterval(checkProcessingStatus, 1000);

// Function to mark an element as processing
function markProcessing(id) {
    const statusElement = document.getElementById(id);
    
    if (!statusElement) {
        console.error(`Element with ID '${id}' not found.`);
        return;
    }

    if (!statusElement.classList.contains('processing')) {
        statusElement.classList.add('processing');
        statusElement.textContent = texts[currentLang].processing;  // Set it to "Processing" text
        //disableFlags();  // Disable flags during processing
        processingCounters[id] = 0;  // Reset the counter when processing starts
    } else {
        console.log(`Element ${id} is already processing.`);
    }
}



// Add this to your
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.overlay');
    const intensityOverlay = document.getElementById('intensity-overlay');
    const intensitySlider = document.getElementById('intensity-slider');
    const intensityValue = document.getElementById('intensity-value');
    let selectedButtonId = null; // To store the ID of the clicked button
    let intensitySubmitted = false; // Track if the intensity popup was submitted

    function disableButtons() {
        document.querySelectorAll('button').forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
        localStorage.setItem('buttonsDisabled', 'true');
        document.querySelector('.inactive-overlay').style.display = 'flex';
    }

    function enableButtons() {
        document.querySelectorAll('button').forEach(button => {
            button.disabled = false;
            button.classList.remove('disabled');
        });
        localStorage.removeItem('buttonsDisabled');
        document.querySelector('.inactive-overlay').style.display = 'none';
    }

    // Disable buttons initially until we get the uptime status
    disableButtons();

    function checkUptime() {
        fetch('/get-uptime')
            .then(response => response.json())
            .then(data => {
                const message = data.message;
                const uptimeElement = document.getElementById('uptime-server');
                if (message.startsWith('<UPTIME=OK>') || message === '') {
                    uptimeElement.textContent = 'Server is running.';
                    enableButtons();
                } else if (message.startsWith('<UPTIME=')) {
                    const minutes = message.match(/<UPTIME=(\d+)>/)[1];
                    uptimeElement.textContent = `Server was restarted. Please wait ${minutes} minutes.`;
                    document.getElementById('s-restart').style.display='block';
                    enableButtons();
                }
            })
            .catch(error => {
                console.error('Error fetching uptime status:', error);
            });
    }

    checkUptime();
    setInterval(checkUptime, 10000); // Check uptime every 60 seconds

    const allButtons = document.querySelectorAll('button');

    allButtons.forEach(button => {
        button.addEventListener('click', async () => {
            if (button.id === 'set-1' || button.id === 'set-2' || button.id === 'set-3' || button.id === 'set-4') {
                selectedButtonId = button.id; // Store the ID of the clicked button
                intensityOverlay.style.display = 'flex';
                
                const hallId = button.id.split('-')[1]; // Extract the last character to get the hall ID
                const data = await fetchlights();
                
                if (data && data[hallId]) {
                    intensityValue.textContent = data[hallId].intensity + '%';
                    intensitySlider.value = data[hallId].intensity;
                } else {
                    console.error('Failed to update intensity');
                    intensityValue.textContent = 'N/A';
                }
    
                intensitySubmitted = false; // Reset the submission flag
            } else {
                // Show loading screen for other buttons
                if(button.id === 'closeIntensityPopup') {return;}
                overlay.style.display = 'flex';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 10000);
                // Add other actions for non-specific buttons here if needed
            }
        });
    });

    function closeIntensityPopup() {
        intensityOverlay.style.display = 'none';
        selectedButtonId = null; // Reset the selected button if cancel is clicked
    }

    function submitIntensity() {
        if (selectedButtonId) {
            let message = selectedButtonId; // Use the ID of the button for the message
            const intensity = intensitySlider.value;
            console.log(message);
            sendToServer(message, intensity);

            // Map button ID to hall number
            const hallMap = {
                'set-1': 1,
                'set-2': 2,
                'set-3': 3,
                'set-4': 4
            };

            const hallNumber = hallMap[message];
            if (hallNumber) {
                sendLightStatus(hallNumber, true, intensity);
            } else {
                console.error('Invalid hall number');
            }

            // Mark the intensity as submitted
            intensitySubmitted = true;

            // Show loading screen after submit
            overlay.style.display = 'flex';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 10000);

            closeIntensityPopup();
        }
    }

    document.getElementById('intensity-submit').addEventListener('click', submitIntensity);

    document.getElementById('closeIntensityPopup').addEventListener('click', () => {
        closeIntensityPopup();
        intensitySubmitted = false; // Ensure the submission flag is false if cancelled
    });

    // Update the intensity value display
    intensitySlider.addEventListener('input', () => {
        intensityValue.textContent = `${intensitySlider.value}%`;
    });

    // Set the slider step to 10
    intensitySlider.setAttribute('step', 10);

    // Translation
    const flags = document.querySelectorAll('.flag');

    flags.forEach(flag => {
        flag.addEventListener('click', () => {
            const lang = flag.id;
            currentLang = lang;  // Update current language
            document.getElementById('control-title').textContent = texts[lang].controlTitle;
            document.getElementById('window-title').textContent = texts[lang].windowTitle;
    
            updateButtonText('set-1', texts[lang].lightOpen[0], 'status-1');
            updateButtonText('set-2', texts[lang].lightOpen[1], 'status-2');
            updateButtonText('set-3', texts[lang].lightOpen[2], 'status-3');
            updateButtonText('set-4', texts[lang].lightOpen[3], 'status-4');
            
            updateButtonText('intensity-title', texts[lang].intTitle);
            updateButtonText('intensity-submit', texts[lang].submitButton);
            updateButtonText('closeIntensityPopup', texts[lang].cancelButton);
    
            updateButtonText('hall-1-open', texts[lang].hallOpen[0], 'hall-1-status-open');
            updateButtonText('hall-2-open', texts[lang].hallOpen[1], 'hall-2-status-open');
            updateButtonText('hall-3-open', texts[lang].hallOpen[2], 'hall-3-status-open');
            updateButtonText('hall-4-open', texts[lang].hallOpen[3], 'hall-4-status-open');
            updateButtonText('hall-1-close', texts[lang].hallClose[0]);
            updateButtonText('hall-2-close', texts[lang].hallClose[1]);
            updateButtonText('hall-3-close', texts[lang].hallClose[2]);
            updateButtonText('hall-4-close', texts[lang].hallClose[3]);
            document.getElementById('set-def').textContent = texts[lang].setDefault;

            //updateWindowsAutoStatus();
            checkAllWindowsStatus();
            fetchXbeeData();
            fetchLightStatus();
            updateStatusTexts();
    
            // Force the correct text for window buttons after all updates
            ['hall-1-status-open', 'hall-2-status-open', 'hall-3-status-open', 'hall-4-status-open'].forEach(spanId => {
                const statusElement = document.getElementById(spanId);
                if (statusElement) {
                    const status = relayStatus[spanId];
                    const statusText = status === 'Y'
                        ? texts[currentLang].statusWindowOpened
                        : texts[currentLang].statusWindowClosed;
                    
                    statusElement.textContent = statusText;
                }
            });
        });
    });
    

    function updateButtonText(buttonId, newText, spanId = null) {
        const button = document.getElementById(buttonId);
        let span = button.querySelector('span');
    
        // Check if the span exists, if not, create one
        if (!span && spanId) {
            span = document.createElement('span');
            span.id = spanId;
            span.classList.add('status-text');
            button.appendChild(span);
        }
    
        // Update button text but preserve the span
        if (spanId) {
            button.childNodes[0].textContent = newText + " "; // Update button text, add space before span
        } else {
            button.textContent = newText;
        }
    
    
        // Handle status update for window buttons specifically
        if (spanId && relayStatus[spanId]) {
            const status = relayStatus[spanId];
            const isWindowButton = ['hall-1-open', 'hall-2-open', 'hall-3-open', 'hall-4-open'].includes(buttonId);
    
            // Use the correct text based on window button status
            const statusText = isWindowButton
                ? (status === 'Y' ? texts[currentLang].statusWindowOpened : texts[currentLang].statusWindowClosed)
                : (status === 'Y' ? texts[currentLang].statusActive: texts[currentLang].statusInactive);
    
            const statusClass = status === 'Y' ? 'active' : 'inactive';

            // Update the span text
            span.textContent = statusText;
    
            // Remove previous classes and add the new class based on status
            span.classList.remove('active', 'inactive', 'processing');
            span.classList.add(statusClass);
    
            // Check if processing class needs to be restored
            if (relayStatus[spanId] === 'processing') {
                span.classList.add('processing');
                span.textContent = texts[currentLang].processing; // Override to show processing state
            }
        } else {
        }
    }
    
    
    function updateStatusTexts() {
        const statusElements = document.querySelectorAll('.status-text');
        statusElements.forEach(statusElement => {
            const parentButtonId = statusElement.closest('button').id;
    
            // Check if the parent button is one of the specific window buttons
            const isWindowButton = ['hall-1-open', 'hall-2-open', 'hall-3-open', 'hall-4-open'].includes(parentButtonId);
    
            // Preserve the 'processing' state if it's currently set
            if (statusElement.classList.contains('processing')) {
                statusElement.textContent = texts[currentLang].processing;  // Update processing text based on language
            } else if (statusElement.classList.contains('active')) {
                // If it's a window button and has 'active' class, use 'statusWindowOpened'
                statusElement.textContent = isWindowButton 
                    ? texts[currentLang].statusWindowOpened 
                    : texts[currentLang].statusActive;
            } else if (statusElement.classList.contains('inactive')) {
                // If it's a window button and has 'inactive' class, use 'statusWindowClosed'
                statusElement.textContent = isWindowButton 
                    ? texts[currentLang].statusWindowClosed 
                    : texts[currentLang].statusInactive;
            }

        });
    }
    
    const relayStatus = {};
    function updateStatus(id, status) {
        const statusElement = document.getElementById(id);
        relayStatus[id] = status; // Store the status in the relayStatus object
    
        // Check if the element is a window button
        const isWindowButton = ['hall-1-status-open', 'hall-2-status-open', 'hall-3-status-open', 'hall-4-status-open'].includes(id);
    
        // Determine the normal status text (without processing)
        const normalStatusText = isWindowButton
            ? (status === 'Y' ? texts[currentLang].statusWindowOpened : texts[currentLang].statusWindowClosed)
            : (status === 'Y' ? texts[currentLang].statusActive : texts[currentLang].statusInactive);
    
        // Check if the element is currently in a 'processing' state
        if (statusElement.classList.contains('processing')) {
            // If transitioning from processing to a normal state
            if ((statusElement.classList.contains('active') && status !== 'Y') ||
                (statusElement.classList.contains('inactive') && status === 'Y')) {
                // Update to the new normal state (remove 'processing')
                statusElement.textContent = normalStatusText;
                statusElement.classList.remove('processing');
    
                // Apply the appropriate classes based on the new state
                if (status === 'Y') {
                    statusElement.classList.add('active');
                    statusElement.classList.remove('inactive');
                } else {
                    statusElement.classList.add('inactive');
                    statusElement.classList.remove('active');
                }
            } else {
                // If still in the processing state, add processing text
                let statusText = `${normalStatusText} (${texts[currentLang].processing})`;
                statusElement.textContent = statusText;
    
                // Ensure 'processing' class is added
                statusElement.classList.add('processing');
            }
        } else {
            // If not processing, simply update to the normal state
            statusElement.textContent = normalStatusText;
    
            // Apply the appropriate classes
            if (status === 'Y') {
                statusElement.classList.add('active');
                statusElement.classList.remove('inactive');
            } else {
                statusElement.classList.add('inactive');
                statusElement.classList.remove('active');
            }
    
            // Ensure 'processing' class is removed
            statusElement.classList.remove('processing');
        }
    }
    
    
    function handleMessage(message) {
        const relayStatusMessages = message.split(';');
        relayStatusMessages.forEach(status => {
            const [relay, state] = status.split('=');
            switch (relay) {
                case 'r1':
                    updateStatus('hall-1-status-open', state);
                    break;
                case 'r2':
                    updateStatus('hall-2-status-open', state);
                    break;
                case 'r3':
                    updateStatus('hall-3-status-open', state);
                    break;
                case 'r4':
                    updateStatus('hall-4-status-open', state);
                    break;
            }
        });
    }

    function fetchXbeeData() {
        fetch('/xbee-data')
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    handleMessage(data.message);
                }
            })
            .catch(error => console.error('Error fetching xBee data:', error));
    }

    // Fetch the data initially and set an interval to fetch it periodically
    fetchXbeeData();
    setInterval(fetchXbeeData, 5000); // Fetch data every 5 seconds

    

    async function fetchlights() {
        try {
            const response = await fetch('/lights-status');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching light status:', error);
            return null;
        }
    }
    

    function fetchLightStatus() {
        fetch('/lights-status')
            .then(response => response.json())
            .then(data => {
                timeh1=data["1"].time;
                timeh2=data["2"].time;
                timeh3=data["3"].time;
                timeh4=data["4"].time;
                //console.log(data,timeAgo1);
                updateButtonStatus(data);
            })
            .catch(error => {
                console.error('Error fetching light status:', error);
            });
    }
    
    function updateButtonStatus(statusData) {
        setTimeUpdatedAgo();

        for (let hall in statusData) {
            const statusElement = document.getElementById(`status-${hall}`);
            const intensityElement = document.getElementById(`intensity-${hall}`); // Assuming you have elements to display intensity
    
            const isActive = statusData[hall].status === 'on';
            const intensity = statusData[hall].intensity;
    
            // If it's a window button, use window-specific texts
            if (['hall-1-open', 'hall-2-open', 'hall-3-open', 'hall-4-open'].includes(`status-${hall}`)) {
                statusElement.textContent = isActive ? texts[currentLang].statusWindowOpened : texts[currentLang].statusWindowClosed;
            } else {
                statusElement.textContent = isActive ? texts[currentLang].statusActive + (globalState ? ' ' + texts[currentLang].auto : ' ' + texts[currentLang].manual): texts[currentLang].statusInactive;
            }
    
            statusElement.classList.toggle('active', isActive);
            statusElement.classList.toggle('inactive', !isActive);
    
            if (intensityElement) {
                intensityElement.textContent = `Intensity: ${intensity}%`; // Update intensity display
            }
        }
        
    }
    
    
    fetchLightStatus();
    setInterval(fetchLightStatus, 5000); // Fetch data every 5 seconds

    function checkTimeAndToggleButtons(currentTime) {
        const timeWindows = [
            { start: { hours: 14, minutes: 25 }, end: { hours: 14, minutes: 35 } },
            { start: { hours: 5, minutes: 25 }, end: { hours: 5, minutes: 35 } },
            { start: { hours: 19, minutes: 55 }, end: { hours: 20, minutes: 5 } },
            { start: { hours: 6, minutes: 25 }, end: { hours: 6, minutes: 35 } }
        ];
    
        const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        let isWithinTimeWindow = false;
        let disableEndTime = null;
    
        timeWindows.forEach(window => {
            const startMinutes = window.start.hours * 60 + window.start.minutes;
            const endMinutes = window.end.hours * 60 + window.end.minutes;
    
            if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
                isWithinTimeWindow = true;
                disableEndTime = new Date(currentTime);
                disableEndTime.setHours(window.end.hours, window.end.minutes, 0, 0);
            }
        });
    
        if (isWithinTimeWindow) {
            disableButtons();
            const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    
            document.getElementById('time-remain').textContent = `Kérem várjon ${disableEndTime.toLocaleTimeString('hu-HU', timeOptions)} - ig`;
            document.getElementById('time-remain-1').textContent = `Prosím počkajte do ${disableEndTime.toLocaleTimeString('sk-SK', timeOptions)}`;
            document.getElementById('time-remain-2').textContent = `Please wait till ${disableEndTime.toLocaleTimeString('en-US', timeOptions)}`;
            document.getElementById('time-remain-1').style.color = 'red';
            document.getElementById('time-remain-2').style.color = 'red';
            document.getElementById('s-restart').style.display = 'none';
        } else {
            document.getElementById('time-remain').textContent = '';
            document.getElementById('time-remain-1').textContent = '';
            document.getElementById('time-remain-2').textContent = '';
            document.getElementById('time-remain-1').style.color = '';
            document.getElementById('time-remain-2').style.color = '';
        }
    }
    
    
    function fetchTimeAndCheck() {
        fetch('/get-time')
            .then(response => response.json())
            .then(data => {
                const serverTime = new Date(data.message);
                checkTimeAndToggleButtons(serverTime);
            })
            .catch(error => {
                console.error('Error fetching time:', error);
            });
    }

    function initializeButtons() {
        const buttonsDisabled = localStorage.getItem('buttonsDisabled') === 'true';

        if (buttonsDisabled) {
            document.querySelector('.inactive-overlay').style.display = 'flex';
            disableButtons();
        } else {
            document.querySelector('.inactive-overlay').style.display = 'none';
            enableButtons();
        }

        fetchTimeAndCheck();
    }

    initializeButtons();

    setInterval(fetchTimeAndCheck, 5000);
    
    function createWebSocket() {
        let socket = new WebSocket('ws://localhost:8080');
    
        socket.addEventListener('open', () => {
            console.log("WebSocket connected.");
        });
    
        socket.addEventListener('error', (error) => {
            console.error("WebSocket error:", error);
        });
    
        socket.addEventListener('close', () => {
            console.warn("WebSocket disconnected, reconnecting in 5 seconds...");
            setTimeout(createWebSocket, 5000);
        });
    
        socket.addEventListener('message', function (event) {
            console.log('Message from server:', event.data);
            if (event.data === 'ERR44') {
                showErrorOverlay();
            } else if (event.data === 'RESET') {
                resetErrorState();
            }
        });
    
        return socket;
    }
    
    // Restart WebSocket every 10 minutes
    setInterval(() => {
        console.warn("Restarting WebSocket connection to prevent freeze...");
        socket.close();
        createWebSocket();
    }, 600000); // Every 10 minutes
    

    function showErrorOverlay() {
        // Show the overlay
        document.getElementById('errorOverlay').style.display = 'block';
        // Prevent user interaction
        document.body.classList.add('error-active');
        // Store the error state persistently
        localStorage.setItem('errorActive', 'true');
    }

    function resetErrorState() {
        // Hide the overlay and allow interaction
        document.getElementById('errorOverlay').style.display = 'none';
        document.body.classList.remove('error-active');
        // Clear the persistent error state
        localStorage.removeItem('errorActive');
    }

    // Prevent refresh from bypassing the overlay
    window.addEventListener('beforeunload', function (event) {
        if (localStorage.getItem('errorActive') === 'true') {
            event.preventDefault();
            event.returnValue = ''; // Required for Chrome
        }
    });


});
