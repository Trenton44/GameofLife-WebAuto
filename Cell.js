const genColor = (min=150, max=255) => Math.floor(Math.random() * (max-min+1)) + min;
const Black = [0, 0, 0, 255];
const pixelPositions = (x, y, scalar, width) => {
    let temp = [];
    for(let i=x; i<x+scalar; i++){
        for(let z=y; z<y+scalar; z++)
        { temp.push((z*width+i)*4); }
    }
    return temp;
};
export default class Cell {
    constructor(state, x, y, pixelScalar, gridW){
        this.state = state;
        this.scalar = pixelScalar;
        this.gridPosition = [x, y];
        this.canvasPositions = pixelPositions(...this.gridPosition, this.scalar, gridW);
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
        })
    }
}