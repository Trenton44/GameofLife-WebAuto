import Grid from "./Grid.js";
import Rules from "./Rules.js";

export default class Canvas {
    constructor(ctx, cellSize=1, borderSize=1, grids=1, seed, pattern="square"){
        this.cellSize = cellSize;
        this.gridPattern = pattern;
        this.gridCount = grids;
        this.borderSize = borderSize;
        this.grids = this.#splitCanvas(ctx, seed);
    }
    #splitCanvas(ctx, seed){
        let temp = [];
        const calcCellGrid = (dval, val) => (dval-val)/this.cellSize;
        switch(this.gridPattern){
            default: {
                const gridWidth = (ctx.canvas.width/this.gridCount) - (2*this.borderSize);
                const gridHeight = ctx.canvas.height - (2*this.borderSize);
                const y = this.borderSize;
                const dy = y+gridHeight;
                let dx = (x) => x+gridWidth;
                for(let i=0; i < this.gridCount; i++){
                    let xval = i*gridWidth+this.borderSize;
                    let dxval = dx(xval);
                    temp.push(new Grid(ctx, {
                        x: xval,
                        y: y, 
                        dx: dxval, 
                        dy: dy,
                        size: this.cellSize
                    }, calcCellGrid(dxval, xval), calcCellGrid(dy,y), seed));
                }
            }
        }
        return temp;
    }
}