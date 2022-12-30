const genColor = (min=150, max=255) => Math.floor(Math.random() * (max-min+1)) + min;
const Black = [0, 0, 0, 255];
export default class Cell {
    constructor(alive, x, y, scalar){
        this.alive = alive;
        this.gridPosition = [x, y];
        this.canvasPositions = this.#getCanvasPositions(scalar);
        this.color = [genColor(), genColor(), genColor(), 255];
    }
    #getCanvasPositions(scalar){
        let temp = [];
        let cx = this.gridPosition[0]*scalar;
        let cy = this.gridPosition[1]*scalar;
        for(let i=cx; i<cx+scalar; i++){
            for(let z=cy; z<cy+scalar; z++){
                temp.push([i,z]);
            }
        }
        return temp;
    }
    draw(){ return this.alive ? this.color : Black;  }
}