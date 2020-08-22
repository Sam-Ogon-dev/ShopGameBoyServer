const express = require("express");
const app = express();
const DB = require("./database");
const EmailSender = require("./EmailSender");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", ["*"]);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie");
    next();
}, express.json());


app.get("/games", (req, res) => {
    DB.getGames(req.query).then(r => res.json(r));
})

app.get("/basket", (req, res) => {
    DB.getBasketGames(req.query).then(r => res.json(r));
})

app.get("/genres", (req, res) => {
    DB.getGenres().then(r => res.json(r));
})

app.post("/order", (req, res) => {
    EmailSender(req.body.personData, req.body.order).then(r => res.send(r));
})


console.log("server running...");
app.listen(3001);

