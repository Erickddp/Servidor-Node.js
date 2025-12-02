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

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`La aplicacion esta escuchando en http://localhost:${PORT}`);
});
