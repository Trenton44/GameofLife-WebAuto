import Grid from "./Grid.js";

export default class Canvas {
    constructor(ctx, cellSize=1, borderSize=1, grids=1, seed, pattern="square"){
        this.cellSize = cellSize;
        this.gridPattern = pattern;
        this.gridCount = grids;
        this.borderSize = borderSize;
        this.borderCoords = [];
        this.borderCoords.push([0,0,ctx.canvas.width, ctx.canvas.height]);
        this.grids = this.#splitCanvas(ctx, seed);
        this.#drawBorder(ctx);
        this.grids.forEach(grid => grid.wipeField());
    }
    #splitCanvas(ctx, seed){
        let temp = [];
        const gridWidth = (ctx.canvas.width/this.gridCount) - 2*this.borderSize;
        const gridHeight = ctx.canvas.height - 2*this.borderSize;
        const initialX = (inc) => this.borderSize+(inc*gridWidth)+(inc*this.borderSize*2);
        for(let i = 0; i < this.gridCount; i++){
            let coords = {};
            coords.x = initialX(i);
            coords.y = this.borderSize;
            coords.dx = coords.x + gridWidth - coords.x - this.borderSize;
            coords.dy = coords.y + gridHeight - this.borderSize;
            coords.size = this.cellSize;
            temp.push(new Grid(ctx, coords, coords.dx-coords.x, coords.dy-coords.y, seed));
        }
        return temp;
    }
    #drawBorder(ctx){
        this.borderCoords.forEach(coord => {
            //console.log(coord);
            ctx.beginPath();
            ctx.fillStyle = "purple";
            ctx.fillRect(...coord);
        })
    }
}