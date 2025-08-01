const io = require('socket.io-client');
const path = require('path');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '../.env')
});
const host = process.env.HOST;
const socket = io(`http://${host}`);
const { xBeeSend } = require('./xbee');

function initSocket() {
  socket.on('connect', () => {
    console.log(`Connected to KEMP server: ${host}`);
    socket.emit('xbee-kemp-3');
  });

  socket.on('heartbeat', () => {
    console.log('Received heartbeat');
    socket.emit('ack');
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected from KEMP server: ${host}`);
  });

  socket.on('data-req', (frame) => {
    xBeeSend(frame);
  });

  return socket;
}

function socketOut(type, data) {
  socket.emit(type, data);
}

module.exports = { initSocket, socketOut };
