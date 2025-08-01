const { SerialPort } = require('serialport');
let run = 0;
let handshakeOk = false; // 55 50 44 41 54 45 52
let serialport = null; // Store the serialport instance globally for easy access

const correctXbeeMessage = Buffer.from('7e001088014e490058434f4e54524f4c4c455283', 'hex');
//7e001088014e490058434f4e54524f4c4c455283 // XCONTROLLER

// Function to fully reset the state
function resetState() {
    console.log('Resetting state...');
    handshakeOk = false;
    run = 0;
    
    // Close any existing serial port connection before restarting
    if (serialport && serialport.isOpen) {
        closePort(serialport);
    }
    
    // Restart the XBee initialization
    //setTimeout(findXbeePort, 2000);
}

let bridge = {
  found: false,
  isInitializing: false
};

async function findXbeePortOnly() {
  // Get the current serialport state
  const serialport = getSerialPort();

  // Return early if the port is open
  if (serialport && serialport.isOpen) {
   // console.log('Serial port is already open. Skipping check.');
    return;
  }

  // Otherwise, proceed to check for XBee devices
  console.log('Searching for XBee devices...');

  // Get the list of available ports
  const ports = await SerialPort.list();

  for (const port of ports) {
    if (port.manufacturer === "FTDI") {
      console.log(`XBee-like device found on port: ${port.path}`);
      bridge.found = true;
      return;
    }
  }

  // If no port is found, set `bridge.found` to false
  console.log('No XBee device found');
  bridge.found = false;
}


async function findXbeePort() {
  console.log('Searching for XBee devices...');

  // Set `isInitializing` to true when searching for ports
  bridge.isInitializing = true;

  const ports = await SerialPort.list();

  for (const port of ports) {
      if (port.manufacturer === "FTDI") {
          try {
              serialport = await connectToPort(port); // Assign serialport globally
              const response = await handshakeWithXbee(serialport);

              if (response.equals(correctXbeeMessage)) {
                  console.log(`Found the correct XBee on port: ${serialport.path}`);
                  bridge.found = true;
                  bridge.isInitializing = false; // Reset flag upon successful connection
                        sendSignalToClient('RESET');
                    
                    run += 1;
                  handshakeOk = true;

                  // Return the connected serial port
                  return serialport;
              }
          } catch (error) {
              console.error(`Error on port ${port.path}: ${error.message}`);
          }
      }
  }

  console.log('No XBee device found');
  // Reset `isInitializing` if no device is found
  bridge.isInitializing = false;
}


// Create a getter to provide the most current `serialport`
function getSerialPort() {
    return serialport;
}

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let isClientConnected = false;

wss.on('connection', function connection(ws) {
    console.log('Client connected');
    isClientConnected = true;

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('Hello! Welcome to the WebSocket server.');
});

function sendSignalToClient(signal) {
    if (!isClientConnected) {
        console.log('No client connected, cannot send signal.');
        return;
    }

    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(signal);
            console.log(`Sent ${signal} to client`);
        }
    });
}

function connectToPort(port) {
    return new Promise((resolve, reject) => {
        const serialport = new SerialPort({ path: port.path, baudRate: 230400 }, (error) => {
            if (error) {
                console.error(`Failed to open port ${port.path}: ${error.message}`);
                reject(error);
            } else {
                console.log(`Connected to port: ${port.path}`);
                resolve(serialport);
            }
        });
    });
}

function handshakeWithXbee(serialport) {
    return new Promise((resolve, reject) => {
        serialport.on('error', (error) => {
            console.error(`Error on port ${serialport.path}: ${error.message}`);
            reject(error);
        });
        
        serialport.on('data', (data) => {
            console.log(`Received data on port ${serialport.path}: ${data.toString('hex')}`);
            
            if (data.equals(correctXbeeMessage)) {
                console.log(`Successful handshake with XBee on port ${serialport.path}`);
                resolve(data);
            } else if (!handshakeOk) {
                closePort(serialport);
                reject(new Error(`Incorrect response from XBee on port ${serialport.path}: ${data.toString('hex')}`));
            }
        });
        
        console.log(`Sending handshake message to XBee on port ${serialport.path}`);
        serialport.write([0x7E, 0x00, 0x04, 0x08, 0x01, 0x4E, 0x49, 0x5F]);
    });
}

function closePort(serialport) {
    serialport.close((err) => {
        if (err) {
            console.error(`Error closing port ${serialport.path}: ${err.message}`);
        } else {
            console.log(`Port closed: ${serialport.path}`);
        }
    });
}

// Export the findXbeePort and sendSignalToClient functions
module.exports = { findXbeePort, sendSignalToClient, resetState, getSerialPort, bridge,findXbeePortOnly };
