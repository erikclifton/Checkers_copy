//opis pionka
class Piece {
    constructor(color) {
        this._color = color
        this.x = 123
        this.cube = null

    }

    createGeometry = () => {
        const pieceGeometry = new THREE.CylinderGeometry(7, 7, 5, 40);
        const queenGeometry = new THREE.CylinderGeometry(7, 7, 5, 8);//queen ---------------------
        const pieceMaterial1 = new THREE.MeshPhongMaterial({
            //color: 0xff0000,
            specular: 0xffffff,
            shininess: 25,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("materials/piece1.jpg"),
        });
        const pieceMaterial2 = new THREE.MeshPhongMaterial({
            //color: 0xff0000,
            specular: 0xffffff,
            shininess: 25,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("materials/piece2.jpg"),
        });
        var cube;
        if (this._color == 1) {
            cube = new THREE.Mesh(pieceGeometry, pieceMaterial1);
            cube.userData = { player: 1 }
        }
        else if (this._color == 2) {
            cube = new THREE.Mesh(pieceGeometry, pieceMaterial2);
            cube.userData = { player: 2 }
        }
        return cube;
    }

    set color(val) {
        console.log("setter")
        this._color = val
    }
    get color() {
        console.log("getter")
        return this._color
    }

    setX(x) {
        this.x = x

    }

    getX() {
        return this.x

    }

}