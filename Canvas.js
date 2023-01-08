import Grid from "./Grid.js";

const Round = (num, place) => Math.floor(num/place)*place;
export default class Canvas {
    constructor(canvas){
        // round the canvas to the nearest hundredth
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
        // Need to .bind() the class instance as "this".
        this.setupHandlers();
        this.ctx.canvas.width = Round(this.ctx.canvas.width, 100);
        this.ctx.canvas.height = Round(this.ctx.canvas.height, 100);
        console.log("setting up Grids.");
        // grid needs the cell size to be auto-calculated.
        this.grids = [new Grid(this.ctx, {
            x: 0,
            y: 0,
            dx: this.ctx.canvas.width,
            dy: this.ctx.canvas.height
        })];
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
            // add orange effect here.
        };
        this.canvas.onmouseout = (event) => {
            this.grids.forEach(grid => delete grid.effects.hover);
        };
    }
    SubdivideGrid(index){
        let grids = [];
        let current = this.grids[index];
        const width = current.ctxSpace.dx/2;
        const height = current.ctxSpace.dy/2;
        for(let y=0; y < 2; y++){
            for(let x=0; x < 2; x++){
                let grid = new Grid(this.ctx, {
                    x: x*width,
                    y: y*height,
                    dx: width,
                    dy: height
                });
                grid.grid = current.grid.slice(grid.pos[1], grid.pos[1]+grid.height);
                for(let i in grid.grid)
                { grid.grid[i] = grid.grid[i].slice(grid.pos[0], grid.pos[0]+grid.width); }
                grids.push(grid);
            }
        }
        this.grids.splice(index, 1, ...grids);
    }
    findGrid(x, y){
        for(let index in this.grids){
            let coords = this.grids[index].ctxSpace;
            let isX = x > coords.x && x < coords.x + coords.dx;
            let isY = y > coords.y && y < coords.y + coords.dy;
            if(!(isX && isY))
                continue;
            return index;
        }
        return null;
    }

}