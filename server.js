var express = require("express");
var app = express();
app.use(express.text());
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const http = require("http");
app.use(express.json());
var usersCount = 0;
var currentUserId = -1;

var pieces = [
  //1-white, 2-black, 0-none
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
];

app.use(express.static("static")); // serwuje stronę index.html

app.get("/", function (req, res) {
  res.send("index.html");
});

app.post("/addUser", (req, res) => {
  if (usersCount < 2) {
    console.log(req.body);
    usersCount++;
    res.json({ name: req.body.name, id: usersCount });
  } else {
    console.log("There already are two users!");
  }
});

app.post("/sendPieces", (req, res) => {
  const newPieces = req.body.pieces;
  const playerId = req.body.playerId;
  currentUserId = playerId;
  nextUserId();
  pieces = newPieces;
  console.log("from sendPieces" + { pieces: newPieces, currentUserId: currentUserId });
  res.json({ pieces: newPieces, currentUserId: currentUserId });
});

app.get("/currentGameState", (req, res) => {
  console.log("from currentGameState: " + pieces);
  console.log("can play:" + (usersCount == 2));
  console.log("can play:" + (usersCount))
  res.json({ pieces: pieces, currentUserId: currentUserId, canPlay: usersCount == 2 });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

function nextUserId() {
  if (currentUserId == -1) currentUserId = 1;
  else if (currentUserId == 1) currentUserId = 2;
  else currentUserId = 1;
}