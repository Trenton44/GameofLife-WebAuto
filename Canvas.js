import Grid from "./Grid.js";

export default class Canvas {
    constructor(ctx, cellSize=1, borderSize=1, grids=1, seed, pattern="square"){
        this.cellSize = cellSize;
        this.gridPattern = pattern;
        this.gridCount = grids;
        this.borderSize = borderSize;
        this.borderCoords = [];
        this.borderCoords.push([0, 0, ctx.canvas.width, ctx.canvas.height]);
        console.log("setting up Grids.");
        this.grids = this.#splitCanvas(ctx, seed);
        console.log("Grid setup complete.");
        console.log("Drawing borders.");
        this.#drawBorder(ctx);
        console.log("Borders drawn. drawing Grid spaces...");
        this.grids.forEach(grid => grid.wipeField());
        console.log("Grid spaces drawn.");
    }
    #splitCanvas(ctx, seed){
        let temp = [];
        const gridWidth = (ctx.canvas.width/this.gridCount) - this.borderSize;
        const gridHeight = ctx.canvas.height - 2*this.borderSize;
        const initialX = (inc) => this.borderSize+(inc*gridWidth)+(inc*this.borderSize);
        for(let i = 0; i < this.gridCount; i++){
            console.log("Setting up Grid "+i);
            let coords = {};
            coords.x = initialX(i);
            coords.y = this.borderSize;
            coords.dx = coords.x + gridWidth - coords.x - this.borderSize;
            coords.dy = coords.y + gridHeight - this.borderSize;
            coords.size = this.cellSize;
            temp.push(new Grid(ctx, coords, coords.dx, coords.dy, seed));
            console.log(temp[i]);
            console.log("Grid "+i+" setup complete.");
        }
        return temp;
    }
    #drawBorder(ctx){
        this.borderCoords.forEach(coord => {
            ctx.beginPath();
            ctx.fillStyle = "purple";
            ctx.fillRect(...coord);
        })
    }
}