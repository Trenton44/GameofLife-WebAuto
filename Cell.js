const genColor = (min=150, max=255) => Math.floor(Math.random() * (max-min+1)) + min;
const Black = [0, 0, 0, 255];
const pixelPositions = (x, y, scalar, gWidth) => {
    let temp = [];
    let cx = x*scalar;
    let cy = y*scalar;
    let width = gWidth*(scalar*scalar);
    for(let i=cx; i<cx+scalar; i++){
        for(let z=cy; z<cy+scalar; z++){
            console.log("Point: "+i+","+z);
            let converted = ((z*width)+i)*4+(z*1);
            console.log("Spot: "+converted);
            temp.push(converted);
        }
    }
    return temp;
};
export default class Cell {
    constructor(state, x, y, pixelScalar, gWidth){
        this.state = state;
        this.scalar = pixelScalar;
        this.gridPosition = [x, y];
        this.canvasPositions = pixelPositions(...this.gridPosition, this.scalar, gWidth);
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