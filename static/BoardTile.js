class BoardTile {
    constructor(color) {
        this._color = color
        this.cube = null
    }

    createGeometry = () => {
        const tileGeometry = new THREE.BoxGeometry(16, 2, 16);
        const boardBlackMaterial = new THREE.MeshPhongMaterial({
            //color: 0xff0000,
            specular: 0xffffff,
            shininess: 10,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("materials/black.jpg"),
        });
        const boardWhiteMaterial = new THREE.MeshPhongMaterial({
            //color: 0xff0000,
            specular: 0xffffff,
            shininess: 10,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("materials/white.jpg"),
        });
        var cube;
        if (this._color == 0) {
            cube = new THREE.Mesh(tileGeometry, boardBlackMaterial);
            cube.userData = { allowed: true };
        }
        else if (this._color == 1) {
            cube = new THREE.Mesh(tileGeometry, boardWhiteMaterial);
            cube.userData = { allowed: false };
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
}