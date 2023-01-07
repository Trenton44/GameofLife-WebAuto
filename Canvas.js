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
    constructor(canvas){
        // round the canvas to the nearest hundredth
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
        // Need to .bind() the class instance as "this".
        this.setupHandlers();
        this.ctx.canvas.width = Round(this.ctx.canvas.width, 100);
        this.ctx.canvas.height = Round(this.ctx.canvas.height, 100);
        let gcd = GCD(this.ctx.canvas.width, this.ctx.canvas.height);
        this.ratio = [this.ctx.canvas.width/gcd, this.ctx.canvas.height/gcd];
        console.log("setting up Grids.");
        // grid needs the cell size to be auto-calculated.
        this.grids = [new Grid(this.ctx, GridCoords(0, 0, this.ctx.canvas.width, this.ctx.canvas.height, this.ratio))];
        this.grids[0].init();
        console.log("Grid setup complete.");
        console.log("Drawing borders.");
        console.log("Borders drawn. drawing Grid spaces...");
        this.grids.forEach(grid => grid.wipeField());
        console.log("Grid spaces drawn.");
        console.log(this.ctx);
    }
    setupHandlers(){
        this.canvas.onmouseup = (event) => {
            let contextMenu = document.getElementById("canvas-context-menu");
            let gridI = this.findGrid(event.x, event.y);
            if(gridI == null)
                contextMenu.style.visibility = "hidden";
            contextMenu.children[0].innerHTML = "Square "+gridI+": "+this.grids[gridI].ctxSpace;
            contextMenu.style.visibility = "visible";
            return true;
        };
        this.canvas.onmousemove = (event) => {
            // wipe hover effect from all grids, because we have to recheck which grid mouse is on with each even.
            this.grids.forEach(grid => delete grid.effects.hover);
            const OrangeHue = (pixels, inds) => {
                pixels[inds[0]] = pixels[inds[0]] + (255 - pixels[inds[0]])/2;
                pixels[inds[1]] = pixels[inds[1]] + (255 - pixels[inds[1]])/2;
            };
            let gridI = this.findGrid(event.x, event.y);
            if(gridI == null)
                return null;
            this.grids[gridI].effects.hover = OrangeHue;
            console.log(gridI);
            // add orange effect here.
        };
    }
    getGridFromXY(x, y){}
    SubdivideGrid(index){
        let grids = [];
        let current = this.grids[index];
        console.log(current);
        const width = current.ctxSpace.dx/2;
        const height = current.ctxSpace.dy/2;
        for(let y=0; y < 2; y++){
            for(let x=0; x < 2; x++){
                let coords = {};
                coords.x = x*width;
                coords.dx = coords.x + width;
                coords.y = y * height;
                coords.dy = coords.y + height;
                coords.size = current.ctxSpace.size/4;
                let grid = new Grid(this.ctx, coords);
                grid.grid = current.grid.slice(grid.ctxSpace.y, grid.y+grid.ctxSpace.dy);
                grid.grid.forEach(xarr => xarr = xarr.slice(grid.ctxSpace.x, grid.ctxSpace.dx));
                grids.push(grid);
            }
        }
        this.grids.splice(index, 1, ...grids);
    }
    findGrid(x, y){
        for(let i in this.grids){
            let grid = this.grids[i];
            let isX = x > grid.ctxSpace.x && x < grid.ctxSpace.dx;
            let isY = y > grid.ctxSpace.y && y < grid.ctxSpace.dy;
            if(!(isX && isY))
                continue;
            return i;
        }
        return null;
    }

}