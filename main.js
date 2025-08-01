// main.js
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let serverProcess;

// Function to create the Electron window in kiosk mode
function createWindow() {
  mainWindow = new BrowserWindow({
    kiosk: true, // full-screen kiosk mode; remove or change as needed
    autoHideMenuBar: true,
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,   // best practice for security
      contextIsolation: true,   // isolates the context for additional security
    }
  });

  // Load the Express server’s URL
  mainWindow.loadURL('http://localhost:4021');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Function to start your Express server (server.js) as a child process
function startServer() {
  const serverPath = path.join(__dirname, 'app.js');
  serverProcess = spawn('node', [serverPath]);

  serverProcess.stdout.on('data', (data) => {
    console.log(`server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`server error: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`server process exited with code ${code}`);
  });
}

// When Electron is ready, start the server and create the window
app.on('ready', () => {
  startServer();
  // Give the server a moment to start before opening the window
  setTimeout(createWindow, 500);
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});

// When Electron quits, kill the server process
app.on('quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
