#!/usr/bin/env node

/**
 * Module dependencies.
 */

require('dotenv').config();

const app = require('../app');
const debug = require('debug')('game:server');
const http = require('http');
const socketio = require('socket.io');
const socket_controller = require('../controllers/socket_controller');
const models = require('../models');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const io = new socketio.Server(server);

// io.on('connection', );

io.on('connection', (socket) => {
	socket_controller(socket, io);
});

/**
 * Connect to database
 */
 models.connect()
 .then(() => {
	 /**
	  * Listen on provided port, on all network interfaces.
	  */
	 server.listen(port);
	 server.on('error', onError);
	 server.on('listening', onListening);
 })
 .catch(e => {
	 debug('Failed to connect to database:', e);
	 process.exit(1);
 })

/*
Efter att användare fyllt i användarnamn och valt avatar kontrolleras ifall det finns en spelare som är redo att spela.
typ....
if (userReady) {
	prompt('Are you ready?');
} else {
	sätt diven som håller waitingroom till 'show' 
} och igen när det kommer in en spelare som vill spela så måste prompten komma upp....

// find an available player number

const connections = [null, null];

// find an available player
let playerIndex = -1;
for (const i in connections){
	if(connections[i] === null) {
		playerIndex = i;
		break;
	}
}

// ignore player 3
if (playerIndex === -1) return

// tell the connecting client what player number they are
socket.emit('player-number', playerIndex)

console.log(`Player ${playerIndex} has connected`)
*/

/**
 * Listen on provided port, on all network interfaces.
 */


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}
