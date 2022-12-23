const genColor = (min=150, max=255) => Math.floor(Math.random() * (max-min+1)) + min;
const pixelPositions = (x, y, scalar, width) => {
    let temp = [];
    for(let i=x; i<x+scalar; i++){
        for(let z=y; z<y+scalar; z++)
        { temp.push(z*width+i); }
    }
    return temp;
};
export default class Cell {
    constructor(state, x, y, pixelScalar, gridW){
        this.state = state;
        this.scalar = pixelScalar;
        this.gridPosition = [x, y];
        this.canvasPositions = pixelPositions(...this.gridPosition, this.scalar, gridW);
        this.color = state ? [genColor(), genColor(), genColor(), 255] : [0, 0, 0, 255];
        
    }
    draw(arr){
        this.canvasPositions.forEach(pos => {
            arr[pos] = this.color[0];
            arr[pos+1] = this.color[1];
            arr[pos+2] = this.color[2];
            arr[pos+3] = this.color[3];
        })
    }
}