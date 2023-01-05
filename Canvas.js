import Grid from "./Grid.js";
const GCD = (a, b) => b == 0 ? a : GCD(b, a%b);
const Round = (num, place) => Math.floor(num/place)*place;
const GridCoords = (x, y, width, height, size) => {
    let coords = {};
    coords.x = x;
    coords.y = y;
    coords.dx = width;
    coords.dy = height;
    coords.size = size;
    return coords;
};
export default class Canvas {
    constructor(ctx){
        // round the canvas to the nearest hundredth
        this.ctx = ctx;
        ctx.canvas.width = Round(ctx.canvas.width, 100);
        ctx.canvas.height = Round(ctx.canvas.height, 100);
        let gcd = GCD(ctx.canvas.width, ctx.canvas.height);
        this.ratio = [ctx.canvas.width/gcd, ctx.canvas.height/gcd];
        this.borderCoords = [[0, 0, ctx.canvas.width, ctx.canvas.height]];
        console.log("setting up Grids.");
        this.grids = [new Grid(ctx, GridCoords(0, 0, ctx.canvas.width, ctx.canvas.height))];
        this.grids[0].init();
        console.log("Grid setup complete.");
        console.log("Drawing borders.");
        this.borderCoords.forEach(coord => {
            ctx.beginPath();
            ctx.fillStyle = "purple";
            ctx.fillRect(...coord);
        });
        console.log("Borders drawn. drawing Grid spaces...");
        this.grids.forEach(grid => grid.wipeField());
        console.log("Grid spaces drawn.");
        console.log(ctx);
    }
    getGridFromXY(x, y){}
    SubdivideGrid(index){
        let grids = [];
        let current = this.grids[index];
        for(let ystep=0; ystep < 2; ystep++){
            for(let xstep=0; xstep < 2; xstep++){
                let coords = {};
                coords.x = xstep * (current.ctxSpace.dx/xstep);
                console.log([xstep, current.ctxSpace.dx, xstep]);
                coords.dx = current.ctxSpace.dx/xstep;
                coords.y = ystep * (current.ctxSpace.y/ystep);
                coords.dy = current.ctxSpace.dy/ystep;
                coords.size = xstep * ystep;
                console.log(coords);
                let grid = new Grid(this.ctx, coords);
                let gridx = xstep * (current.width/xstep);
                let gridy = ystep * (current.height/ystep);
                let griddx = current.width/xstep;
                let griddy = current.height/ystep;
                let gslice = current.grid.slice(gridy, gridy+griddy);
                gslice.forEach(yarr => yarr.slice(gridx, gridx+griddx));
                grid.grid = gslice;
                // copy slice of 2d grid from current to the new grid obtained
                grids.push(grid);
            }
        }
        this.grids.splice(index, 1, ...grids);
    }
}