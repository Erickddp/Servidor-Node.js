const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Capture console.log and console.error
const originalLog = console.log;
const originalError = console.error;

console.log = function(...args) {
    originalLog.apply(console, args);
    const message = args.map(arg =>
        (typeof arg === 'object') ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    io.emit('log', message);
};

console.error = function(...args) {
    originalError.apply(console, args);
    const message = args.map(arg =>
        (typeof arg === 'object') ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    io.emit('error-log', message);
};

app.get("/message", function(req, res) {
    res.send("lista de mensajes");
});

app.delete("/message", function(req, res) {
    console.log("Delete request received at /message");
    res.send("Mensaje añadido correctamente");
});

// Setup Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected via socket.io');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Live Simulation Mode
const logMessages = [
    { type: 'INFO', msg: 'Compiling assets...' },
    { type: 'INFO', msg: 'Optimization pass complete.' },
    { type: 'WARN', msg: 'Database Ping: 215ms' },
    { type: 'WARN', msg: 'High CPU usage detected: 85%' },
    { type: 'SYSTEM', msg: 'Allocating memory block 0x4F...' },
    { type: 'SYSTEM', msg: 'Garbage collection started.' },
    { type: 'HACK', msg: 'Unauthorized access attempt blocked IP: 192.168.1.5' },
    { type: 'HACK', msg: 'Brute force attack detected on port 22' },
    { type: 'HACK', msg: 'SQL Injection attempt mitigated' }
];

setInterval(() => {
    const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
    const message = `[${randomLog.type}] ${randomLog.msg}`;
    console.log(message);
}, 2000);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`La aplicacion esta escuchando en http://localhost:${PORT}`);
});
