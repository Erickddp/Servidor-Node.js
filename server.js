const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

router.get("/message", function(req, res) {
    res.send("lista de mensajes");
});
router.delete("/message", function(req, res) {
    console.log("req.body");
    res.send("Mensaje añandido correctamente");
});

app.listen(3000);
console.log("La aplicacion esta escuchando en http://localhost:3000");