class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
    this.camera.position.set(140, 120, 0);
    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x000000);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.board = [
      //1-white, 0-black
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
    ];
    this.pieces = [
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

    this.positionClicked = [];
    this.selectedPiece;
    this.currentObjectClicked;
    this.player1turn = true;

    document.getElementById("root").append(this.renderer.domElement);

    this.render(); // wywołanie metody render
    //this.generateBoard();
    //this.createPieces() 
  }

  isBoardCreated = () => this.scene.children.length > 0;
  generateBoard = () => {
    console.log("generate board");

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        var tile = new BoardTile(this.board[i][j]);
        let cube = tile.createGeometry();
        cube.position.set(-56 + i * 16, 0, -56 + j * 16);
        //this.scene.remove(cube);
        this.scene.add(cube);
      }
    }
    const light1 = new THREE.HemisphereLight(0xffffff, 10); //SpotLight HemisphereLight
    light1.position.set(0, 56, 0);
    light1.target = this.scene;
    light1.intensity = 0.75;
    this.scene.add(light1);
  };

  createPieces = () => {
    console.log("create pieces");
    this.scene.children = [];
    this.generateBoard();

    for (let i = 0; i < this.pieces.length; i++) {
      for (let j = 0; j < this.pieces[i].length; j++) {
        var piece = new Piece(this.pieces[i][j]);
        piece.userData = { x: "x" }; ///////////////////////////////----------------------
        piece.setX(444);
        let cube = piece.createGeometry();

        if (cube != null) {
          cube.position.set(-56 + i * 16, 2, -56 + j * 16);
          this.scene.add(cube);
        }
        //this.scene.remove(cube);
      }
    }
    if (ui.clientID == 2) {
      this.camera.position.set(-140, 120, 0); //zmien pozycje swiatla
      this.camera.lookAt(this.scene.position);
    }
  };

  render = () => {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
    console.log("render leci, taborecik");
    TWEEN.update(); //---------------------------------------------animacja
  };

  clickOnSth = (e) => {
    const raycaster = new THREE.Raycaster(); // obiekt Raycastera symulujący "rzucanie" promieni
    const mouseVector = new THREE.Vector2(); // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D

    //window.addEventListener("mousedown", (e) => {
    console.log("click");
    mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseVector, this.camera);
    const intersects = raycaster.intersectObjects(this.scene.children);
    //console.log(intersects.length)
    if (intersects.length > 0) {
      //console.log(intersects);

      // zerowy w tablicy czyli najbliższy kamery obiekt to ten, którego potrzebujemy:

      //console.log(intersects[0].object);
      let clickedItem = intersects[0].object;
      //console.log("--------------------------------", clickedItem);

      if (clickedItem.material.shininess == 25) {
        if (this.currentObjectClicked != "piece") {
          if (
            this.player1turn == true &&
            clickedItem.userData.player == 1 &&
            ui.clientID == 1
          ) {
            clickedItem.material.color.setHex(0x999999);
            this.selectedPiece = clickedItem;
            this.player1turn = false;
            this.currentObjectClicked = "piece";
          }
          if (
            this.player1turn == false &&
            clickedItem.userData.player == 2 &&
            ui.clientID == 2
          ) {
            clickedItem.material.color.setHex(0x774444);
            this.selectedPiece = clickedItem;
            this.player1turn = true;
            this.currentObjectClicked = "piece";
          }
        }
      } else {
        if (this.currentObjectClicked != "board") {
          let clickedItemPosition = {
            x: clickedItem.position.x * 1,
            y: clickedItem.position.y * 1,
            z: clickedItem.position.z * 1,
          };

          this.positionClicked.push(clickedItem.position);
          console.log(this.positionClicked);
          if (this.positionClicked.length > 0) {
            /*  animacja
                        new TWEEN.Tween(this.selectedPiece.position) // co
                            .to({ x: pos.x, z: pos.z }, 500) // do jakiej pozycji, w jakim czasie
                            .repeat(1) // liczba powtórzeń
                            .easing(TWEEN.Easing.Bounce.Out) // typ easingu (zmiana w czasie)
                            .onUpdate(() => { console.log(cube.position) })
                            .onComplete(() => { console.log("koniec animacji") } // funkcja po zakończeniu animacji
                            .start()
                        */

            //console.log("test czy to dziala " + this.selectedPiece.c);

            let pos = {
              x: this.positionClicked[this.positionClicked.length - 1].x,
              y: this.positionClicked[this.positionClicked.length - 1].y,
              z: this.positionClicked[this.positionClicked.length - 1].z,
            };
            console.log(pos);

            if (
              this.selectedPiece.userData.player == 1 &&
              clickedItem.userData.allowed
            ) {
              if (
                this.selectedPiece.position.x >
                this.positionClicked[this.positionClicked.length - 1].x &&
                this.selectedPiece.position.x <
                this.positionClicked[this.positionClicked.length - 1].x + 17
              ) {
                if (
                  this.selectedPiece.position.z >
                  this.positionClicked[this.positionClicked.length - 1].z -
                  17 &&
                  this.selectedPiece.position.z <
                  this.positionClicked[this.positionClicked.length - 1].z +
                  17 &&
                  ui.clientID == 1
                ) {
                  //-56 + i * 16, 2, -56 + j * 16
                  let xIndex = (this.selectedPiece.position.x + 56) / 16;
                  let zIndex = (this.selectedPiece.position.z + 56) / 16;
                  this.pieces[xIndex][zIndex] = 0;
                  //console.log(this.selectedPiece.position.x)
                  new TWEEN.Tween(this.selectedPiece.position) // co
                    .to({ x: pos.x, z: pos.z }, 750) // do jakiej pozycji, w jakim czasie
                    .easing(TWEEN.Easing.Sinusoidal.Out) // typ easingu (zmiana w czasie)
                    .onUpdate(() => {
                      console.log(this.selectedPiece.position);
                    })
                    .onComplete(() => {
                      console.log("koniec animacji");
                    }) // funkcja po zakończeniu animacji
                    .start();
                  /*this.selectedPiece.position.set(
                    this.positionClicked[this.positionClicked.length - 1].x,
                    this.positionClicked[this.positionClicked.length - 1].y + 2,
                    this.positionClicked[this.positionClicked.length - 1].z
                  );*/
                  xIndex = (this.selectedPiece.position.x + 56) / 16;
                  zIndex = (this.selectedPiece.position.z + 56) / 16;
                  this.pieces[xIndex][zIndex] = 1;
                  net.sendPieces(this.pieces); //send pieces ------------------
                  console.log(xIndex, zIndex);
                  console.log(this.pieces);
                  this.selectedPiece.material.color.setHex(0xffffff);
                  //this.createPieces();
                  this.currentObjectClicked = "board";
                }
              }
            }
            if (
              this.selectedPiece.userData.player == 2 &&
              clickedItem.userData.allowed
            ) {
              if (
                this.selectedPiece.position.x <
                this.positionClicked[this.positionClicked.length - 1].x &&
                this.selectedPiece.position.x >
                this.positionClicked[this.positionClicked.length - 1].x - 17
              ) {
                if (
                  this.selectedPiece.position.z >
                  this.positionClicked[this.positionClicked.length - 1].z -
                  17 &&
                  this.selectedPiece.position.z <
                  this.positionClicked[this.positionClicked.length - 1].z +
                  17 &&
                  ui.clientID == 2
                ) {
                  let xIndex = (this.selectedPiece.position.x + 56) / 16;
                  let zIndex = (this.selectedPiece.position.z + 56) / 16;
                  this.pieces[xIndex][zIndex] = 0;
                  //console.log(this.selectedPiece.position.x)
                  this.selectedPiece.position.set(
                    this.positionClicked[this.positionClicked.length - 1].x,
                    this.positionClicked[this.positionClicked.length - 1].y + 2,
                    this.positionClicked[this.positionClicked.length - 1].z
                  );
                  xIndex = (this.selectedPiece.position.x + 56) / 16;
                  zIndex = (this.selectedPiece.position.z + 56) / 16;
                  this.pieces[xIndex][zIndex] = 2;
                  net.sendPieces(this.pieces); //send pieces ------------------
                  console.log(xIndex, zIndex);
                  console.log(this.pieces);
                  this.selectedPiece.material.color.setHex(0xffffff);
                  //this.createPieces();
                  this.currentObjectClicked = "board";
                }
              }
            }
          }
        }
      }
    }
  };
}

window.addEventListener("mousedown", (e) => {
  game.clickOnSth(e);
});
