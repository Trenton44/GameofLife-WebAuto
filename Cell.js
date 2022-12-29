const genColor = (min=150, max=255) => Math.floor(Math.random() * (max-min+1)) + min;
const Black = [0, 0, 0, 255];
const rescaleCoord = (coord, scalar) => coord*scalar*scalar;
const pixelPositions = (x, y, scalar, cWidth) => {
    let temp = [];
    //let newVal = (y+1)*(x+1)*scalar*scalar*scalar*scalar*4;
    let cx = rescaleCoord(x, scalar);
    let dcx = cx+scalar;
    let cy = rescaleCoord(y, scalar);
    let dcy = cy+scalar;
    for(let i=cx; i<dcx; i++){
        for(let z=cy; z<dcy; z++){
            temp.push(((cWidth*z)+i)*4);
        }
    }
    return temp;
};
export default class Cell {
    constructor(state, x, y, pixelScalar, cWidth){
        this.state = state;
        this.scalar = pixelScalar;
        this.gridPosition = [x, y];
        this.canvasPositions = pixelPositions(...this.gridPosition, this.scalar, cWidth);
        this.color = [genColor(), genColor(), genColor(), 255];
    }
    set alive(value){ this.state = value; }
    get alive(){ return this.state; }
    draw(arr){
        let color = this.state ? this.color : Black;
        this.canvasPositions.forEach(pos => {
            arr[pos] = color[0];
            arr[pos+1] = color[1];
            arr[pos+2] = color[2];
            arr[pos+3] = color[3];
        });
    }
}