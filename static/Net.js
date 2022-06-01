class Net {
  //var statusPanel = document.getElementById("topPanel");
  //var loginForm = document.getElementById("loginContainer");
  constructor() {
    this.statusPanel = document.getElementById("topPanel");
    this.loginForm = document.getElementById("loginContainer");
    this.nickInput = document.getElementById("nickInput");
    document.getElementById("loginButton").onclick = this.loginClick;
  }
  fetchUser = () => {
    //bez url bo to bedzie na heroku
    console.log(this.nickInput.value);
    var data = { name: this.nickInput.value };
    fetch("/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        ui.clientID = data.id;
        this.loginForm.style.display = "none";
        this.statusPanel.innerText = "added user: " + data.name;
        game.createPieces();
        var bar = new ProgressBar.Circle(
          document.getElementById("loadingBar"),
          {
            strokeWidth: 6,
            easing: "easeInOut",
            duration: 1400,
            color: "#FFEA82",
            trailColor: "#eee",
            trailWidth: 1,
            svgStyle: null,
          }
        );

        bar.animate(1.0);
        //widnow.location.replace("http://localhost:3000/game");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  loginClick = () => {
    console.log("login click");
    this.fetchUser();
  };
  sendPieces = (pieces) => {
    //fetch
    const request = {
      pieces: pieces,
      playerId: ui.clientID
    };
    console.log(pieces);
    fetch("/sendPieces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
  };
  downloadGameState = () => {
    fetch("/currentGameState", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then((response) => response.json()).then(data => {
      //game.player1turn
      console.log(data);
      var shouldUpdateGame = false;
      console.log(data.currentUserId, game.player1turn);
      if (data.currentUserId == 2 && game.player1turn) {
        game.player1turn = false;
        shouldUpdateGame = true;
      }
      else if (data.currentUserId == 1 && !game.player1turn) {
        game.player1turn = true;
        shouldUpdateGame = true;
      }
      console.log(game.isBoardCreated());
      if (data.canPlay && !game.isBoardCreated()) {
        game.pieces = data.pieces;
        game.createPieces();
      } else if (shouldUpdateGame) {
        game.pieces = data.pieces;
        game.createPieces();
        console.log("updated pieces");
      } else {
        console.log("Waiting for users");
      }


    });

  };
  runGameUpdateService = () => {
    console.log("ping");
    setInterval(this.downloadGameState, 5000);
  };
  //document.getElementById("loginButton").onclick = loginClick;
}
