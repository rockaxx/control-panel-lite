const xbee_api = require('xbee-api');
const { exec } = require('child_process');
let xbeeAPI = new xbee_api.XBeeAPI(); // Changed const to let
const { findXbeePort, sendSignalToClient, getSerialPort, bridge, findXbeePortOnly } = require('./xbeeSearch'); // Import `getSerialPort`
let latestXbeeData = '';
let uptimeData = '';
let windowsData = '';
let lastReceivedTime = Date.now();

function getWindowsData() {
    return windowsData; // Return the current value
}

function restartOnPM2() {
    const projectName = 'kemp_control';

    // Execute the pm2 restart command
    exec(`pm2 restart ${projectName}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    });
}

function flushSerialPort(serialport) {
    serialport.flush((err) => {
        if (err) {
            console.error('Error flushing serial port:', err);
        } else {
            console.log('Serial port buffers flushed successfully.');
        }
    });
}

function xBeeInit() {
    // Return early if already initializing
    if (bridge.isInitializing) {
        //console.log('Initialization is already in progress, skipping...');
        return;
    }

    console.log('Initializing XBee connection...');
    bridge.isInitializing = true; // Set flag to prevent reentry

    findXbeePort().then(() => {
        const serialport = getSerialPort(); // Always get the latest serialport

        if (serialport != undefined) {
            // Unpipe existing streams and remove listeners
            if (xbeeAPI && xbeeAPI.builder && xbeeAPI.parser) {
                xbeeAPI.builder.unpipe();
                xbeeAPI.parser.removeAllListeners();
            }

            // Reassign xbeeAPI to a new instance
            xbeeAPI = new xbee_api.XBeeAPI();

            // Unpipe and remove listeners from serialport
            serialport.unpipe();
            serialport.removeAllListeners();

            // Attach listeners
            serialport.pipe(xbeeAPI.parser);
            xbeeAPI.builder.pipe(serialport);

            serialport.on('open', () => {
                console.log(`Serial port ${serialport.path} is open and ready for communication.`);

                // Flush the serial port buffers only after the port is open
                flushSerialPort(serialport);
                bridge.isInitializing = false; // Reset flag after open

                // You can perform any other initialization here if needed
            });

            serialport.on('error', (error) => {
                console.log(`Serial Port Error: ${error}`);
                handleDisconnection(); // Reconnect on port error
            });

            serialport.on('close', () => {
                //console.log('Serial port closed, attempting to reconnect...');
                handleDisconnection(); // Reconnect on port close
            });

            xbeeAPI.parser.on('error', (error) => {
                console.log(`xBee Parser Error: ${error}`);
                handleDisconnection(); // Reconnect on parser error
            });

            xbeeAPI.parser.on('data', (data) => {
                console.log(`xBee In: ${JSON.stringify(data)}, message: ${data.data ? data.data : ``}`);

                if (data.data) {
                    const dataString = data.data.toString();
                    if (dataString.startsWith('<UPTIME')) {
                        uptimeData = dataString;
                    } 
                    else if (dataString.startsWith('<AUTO')) {
                        windowsData = dataString;
                    }
                    else if (dataString.startsWith('<RESTART')) {
                        restartOnPM2();
                    }
                    else {
                        latestXbeeData = dataString;
                    }
                    lastReceivedTime = Date.now();
                    console.log(`xBee Message: ${dataString}`);
                }

                if (data.type === 139) {
                    // Handle frame status
                } else if (data.type === 144) {
                    console.log('Handling incoming data...');
                }
            });

            //console.log('Listeners successfully reattached.');
        } else {
            console.error('Serial port is undefined.');
            bridge.isInitializing = false; // Reset flag if serialport is undefined
        }
    }).catch((error) => {
        console.error(`Failed to initialize XBee: ${error.message}`);
        bridge.isInitializing = false; // Reset flag on error
    });
}

function handleDisconnection() {
    const serialport = getSerialPort();

    if (serialport && serialport.isOpen) {
        // Remove all listeners to ensure a clean state
        serialport.removeAllListeners();

        // Close the port
        serialport.close((err) => {
            if (err) {
                console.error(`Error closing port: ${err.message}`);
            } else {
                console.log(`Port closed successfully`);
                sendSignalToClient('ERR44'); // Send error signal
                bridge.isInitializing = false; // Ensure isInitializing is reset
            }
        });
    } else {
        // If the port is already closed or undefined, trigger reinitialization directly
        sendSignalToClient('ERR44');
        bridge.isInitializing = false; // Ensure isInitializing is reset
    }
}

setInterval(() => {
    findXbeePortOnly().then(() => {
        //console.log('Found:', bridge.found, 'Initializing:', bridge.isInitializing);

        if (bridge.found && !bridge.isInitializing) {
            // Prevent repeated calls
            bridge.found = false;

            // Reinitialize the XBee connection after a delay
            setTimeout(() => {
                xBeeInit();
            }, 1000);
        }
    });
}, 8000);

function xBeeSend(frame) {
    const serialport = getSerialPort(); // Always get the latest serialport

    //console.log('Serialport:', serialport);

    if (serialport && serialport.isOpen) {
        xbeeAPI.builder.write(frame);
        console.log(`xBee Out: ${JSON.stringify(frame)}, message: ${frame.data ? frame.data : ``}`);
    } else {
        console.error("Cannot send data, serial port is not open.");
    }
}

function getLatestXbeeData() {
    return latestXbeeData;
}

function getUptimeData() {
    return uptimeData;
}

module.exports = { xBeeInit, xBeeSend, getLatestXbeeData, getUptimeData, getWindowsData };
