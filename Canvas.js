import Grid from "./Grid.js";
const GCD = (a, b) => b == 0 ? a : GCD(b, a%b);
export default class Canvas {
    constructor(ctx, borderSize=1, grids=1){
        // round the canvas to the nearest hundredth
        ctx.canvas.width = Math.floor(ctx.canvas.width/100)*100;
        ctx.canvas.height = Math.floor(ctx.canvas.height/100)*100;
        let gcd = GCD(ctx.canvas.width, ctx.canvas.height);
        this.ratio = [ctx.canvas.width/gcd, ctx.canvas.height/gcd];
        console.log(this.ratio);
        this.borderCoords = [[0, 0, ctx.canvas.width, ctx.canvas.height]];
        console.log("setting up Grids.");
        //this.grids = this.#splitCanvas(ctx, borderSize, grids);
        console.log("Grid setup complete.");
        console.log("Drawing borders.");
        this.borderCoords.forEach(coord => {
            ctx.beginPath();
            ctx.fillStyle = "purple";
            ctx.fillRect(...coord);
        });
        console.log("Borders drawn. drawing Grid spaces...");
        //this.grids.forEach(grid => grid.wipeField());
        console.log("Grid spaces drawn.");
        console.log(ctx);
    }
    #splitCanvas(ctx, borderSize, grids){
        const gridWidth = (ctx.canvas.width/grids) - borderSize;
        const gridHeight = ctx.canvas.height - 2*borderSize;
        const initialX = (inc) => borderSize+(inc*gridWidth)+(inc*borderSize);
        //calculate aspect ratio of canvas. 4:3, 16:9, etc.
        // this becomes the values of the for loops
        // (Every 4 grids, make a new row)
        for(let i=0; i < grids; i++){
            console.log("Setting up Grid "+i);
            let coords = {};

        }
        return {};
    }
}

/**
 * #splitCanvas(ctx, seed){
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
 */