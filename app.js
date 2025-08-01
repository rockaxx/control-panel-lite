const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const { xBeeInit, xBeeSend, getLatestXbeeData, getUptimeData, getWindowsData } = require('./own_modules/xbee');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

xBeeInit();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function periodDoubleCheck() {
    let state;

    let date = new Date();
    let day = date.getDay();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // DANGEROUS CODE, DONT MESS UP
    if ((day === 6 && (hours > 6 || (hours === 6 && minutes > 30))) || day === 0) {
        // Day 6 after 6:31 AM or any time on Day 0 (Sunday)
        if ((hours > 20) || (hours === 20 && minutes >= 0) || (hours < 6) || (hours === 6 && minutes <= 30)) {
            // Weekend Night from 10:30 PM to 6:30 AM on Saturday and Sunday
            state = 'weekend_night';
        } else {
            // Weekend during the day from 6:31 AM to 10:29 PM on Saturday and Sunday
            state = 'weekend';
        }
    } else if ((day === 6 && (hours <= 6 && minutes <= 30)) || (day !== 6 && day !== 0 && ((hours > 22) || (hours === 22 && minutes >= 31) || (hours < 5) || (hours === 5 && minutes <= 30)))) {
        // Night from 10:31 PM to next day 5:30 AM on non-weekend days, also on Day 6 from 12:00 AM to 6:30 AM
        state = 'night';
    } else if (day !== 0 && day !== 6 && ((hours === 5 && minutes >= 31) || (hours > 5 && hours < 14) || (hours === 14 && minutes <= 30))) {
        // Morning from 5:31 AM to 2:30 PM on Monday to Friday
        state = 'morning';
    } else if (day !== 0 && day !== 6 && ((hours === 14 && minutes >= 31) || (hours > 14 && hours < 22) || (hours === 22 && minutes <= 30))) {
        // Afternoon from 2:31 PM to 10:30 PM on Monday to Friday
        state = 'afternoon';
    }
    
    return state;
}


app.post('/lights-set', (req, res) => {
    var { message, intensity } = req.body;

    if (message === 'set-1' || message === 'set-2' || message === 'set-3' || message === 'set-4') {
        message = message + `;${intensity}`;
    }

    console.log(message, intensity);

    // Create the frame to send the message via XBee
    const frame = {
        type: 0x10, // frame type
        id: 0x01, // Frame ID
        destination64: '0013a20041adaf68',
        broadcastRadius: 0x00,
        options: 0x00,
        data: message
    };

    // Send the frame using xBeeSend
    xBeeSend(frame);

    console.log(frame);

    res.send('OK');
});

app.get('/xbee-data', (req, res) => {
    res.json({ message: getLatestXbeeData() });
});

app.get('/windows-auto-data', (req, res) => {
    const data = getWindowsData(); // Call the function to get the current data
    res.send(data); // Respond with the current data string
});

app.get('/lights-status', (req, res) => {
    const jsonFileName = path.join(__dirname, 'local_json', 'lights_status.json');
    let lightsStatus = {};

    if (fs.existsSync(jsonFileName)) {
        const fileContent = fs.readFileSync(jsonFileName, 'utf8');
        try {
            lightsStatus = JSON.parse(fileContent) || {};
        } catch (err) {
            console.error("Error parsing JSON:", err);
        }
    }

    res.json(lightsStatus);
});

function turnOffAllLights() {
    const jsonFileName = path.join(__dirname, 'local_json', 'lights_status.json');
    let lightsStatus = {};

    // Read the existing lights status
    if (fs.existsSync(jsonFileName)) {
        const fileContent = fs.readFileSync(jsonFileName, 'utf8');
        try {
            lightsStatus = JSON.parse(fileContent) || {};
        } catch (err) {
            console.error("Error parsing JSON:", err);
            lightsStatus = {};
        }
    }

    // Set all halls to 'off'
    [1, 2, 3, 4].forEach(h => {
        lightsStatus[h] = { status: 'off', intensity: 0 };
    });

    // Write the updated content back to the file
    fs.writeFileSync(jsonFileName, JSON.stringify(lightsStatus, null, 2));

    console.log("All lights turned off due to state change");
}

/* // Previous state for comparison
let previousState = periodDoubleCheck();

// Function to check the period state every minute
function checkPeriodState() {
    const currentState = periodDoubleCheck();

    if (currentState !== previousState) {
        // State has changed, turn off all lights
        turnOffAllLights();
        previousState = currentState; // Update previous state
    }
}

// Set an interval to check the period state every minute
setInterval(checkPeriodState, 60000); // 60000 ms = 1 minute

 */
app.post('/set-lights-status', (req, res) => {
    const jsonFileName = path.join(__dirname, 'local_json', 'lights_status.json');
    let { hall, data, intensity } = req.body;
    console.log("new script running");

    // Validate intensity
    if (intensity < -1 || intensity > 100) {
        return res.status(400).json({ error: "Intensity must be between 0 and 100" });
    }

    // Convert boolean data to string status
    if (data === true) {
        data = "on";
    } else {
        data = "off";
    }

    let lightsStatus = {};

    // Read existing file
    if (fs.existsSync(jsonFileName)) {
        const fileContent = fs.readFileSync(jsonFileName, 'utf8');
        try {
            lightsStatus = JSON.parse(fileContent) || {};
        } catch (err) {
            console.error("Error parsing JSON:", err);
            lightsStatus = {};
        }
    }

    let date = new Date();

    if (hall === 9) {
        let newDate = new Date(date);
    
        [1, 2, 3, 4].forEach(h => {
            // Create a new date for each hall to avoid reference issues
            let updatedDate = new Date(newDate);
    
            // Subtract 24 hours for hall 1, and 25 hours for halls 2, 3, 4
            if (h === 1) {
                updatedDate.setHours(updatedDate.getHours() - 22);
            } else {
                updatedDate.setHours(updatedDate.getHours() - 24);
            }
    
            let currentIntensity = lightsStatus[h] ? lightsStatus[h].intensity : null;
            lightsStatus[h] = {
                status: data,
                intensity: intensity !== -1 ? intensity : currentIntensity,
                time: updatedDate
            };
        });
    }
    
    
    else if ([1, 2, 3, 4].includes(hall)) {
        // Validate and set the status for a specific hall
        lightsStatus[hall] = { status: data, intensity: intensity, time:  date};
    } else {
        return res.status(400).send('Invalid hall number');
    }

    // Write updated content back to the file
    fs.writeFileSync(jsonFileName, JSON.stringify(lightsStatus, null, 2));

    res.send('Light status and intensity updated');
});


app.get('/get-time', (req, res) => {
    res.json({ message: new Date().toLocaleString() });
});

app.get('/get-uptime', (req, res) => {
    res.json({ message: getUptimeData() });
});

app.listen(4021, () => {
    console.log('App listening on http://localhost:4021');
});
