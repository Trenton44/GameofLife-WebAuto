import Grid from "./Grid.js";

/**
 * Returns an integer rounded down to the nearest "place" digit (100 = hundredths place, 10= tenths place... etc.)
 * @param {integer} num 
 * @param {integer} place 
 * @returns integer
 */
const Round = (num, place) => Math.floor(num/place)*place;

/** Class representing an html canvas */
export default class Canvas {
    /**
     * Create an instance of Canvas
     * @param {HTMLCanvasElement} canvas - the canvas element on the page
     * @param {HTMLDivElement} overlay - The div element that will display canvas statistics
     * @returns {boolean}
     */
    constructor(canvas, overlay){
        // round the canvas to the nearest hundredth
        this.canvas = canvas;
        this.overlay = overlay;
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
        this.setupHandlers();
        // Rounds width and height to avoid overlapping of cells on pixels
        this.ctx.canvas.width = Round(this.ctx.canvas.width, 100);
        this.ctx.canvas.height = Round(this.ctx.canvas.height, 100);
        console.log("setting up Grids.");
        // create the initial grid, using the entire canvas
        this.grids = [new Grid(this.ctx, {
            x: 0,
            y: 0,
            dx: this.ctx.canvas.width,
            dy: this.ctx.canvas.height
        })];
        // Initialize the first GoL grid with cell data.
        this.grids[0].init();
        console.log("Grid setup complete.");
        this.grids.forEach(grid => grid.wipeField());
        console.log("Grid spaces drawn.");
        return true
    }
    /**
     * Sets up event listeners for the canvas element to respond to user clicks
     * Current Events: 
     *  -OnMouseUp: select grid
     *  -OnMouseMove: apply orange hue to moused over grid
     *  -OnMouseOut: remove all hover effects from grids, to avoid last hovered grid retaining effect.
     */
    setupHandlers(){
        // User click should cause the canvas's overlay div to appear, and populate it with the selected grid's information
        this.canvas.onmouseup = (event) => {
            let gridI = this.findGrid(event.x, event.y);
            if(gridI == null){
                this.overlay.style.visibility = "hidden";
                return false;
            }
            this.grids[gridI].displayData(this.overlay);
            this.overlay.style.visibility = "visible";
            return true;
        };
        // When the user hovers over the canvas with the mouse, should remove the find the grid hovered over, and apply an effect to the cells in this grid to represent the hover visually
        this.canvas.onmousemove = (event) => {
            // wipe hover effect from all grids, because we have to recheck which grid mouse is on with each event.
            this.grids.forEach(grid => delete grid.effects.hover);
            const OrangeHue = (pixels, inds) => {
                pixels[inds[0]] = pixels[inds[0]] + (255 - pixels[inds[0]])/2;
                pixels[inds[1]] = pixels[inds[1]] + (255 - pixels[inds[1]])/2;
            };
            let gridI = this.findGrid(event.x, event.y);
            if(gridI == null)
                return null;
            // applies an orange effect to the pixel array in the affected grid.
            this.grids[gridI].effects.hover = OrangeHue;
        };
        // Moving the mouse off of the canvas should wipe the hover effect from the grids
        this.canvas.onmouseout = (event) => this.grids.forEach(grid => delete grid.effects.hover);
    }
    /**
     * Subdivides the selected grid into 4 seperate Grid (GoL) instances, retaining the existing cells within that divided section.
     * Currently limited to only 4, to preserve aspect ratio (and by extension, game state, as Cell count/pos is currently tied to grid size/ratio).
     * @param {integer} index - the location in this.grids of the grid to be sudivided within the Canvas
     * @returns true
     */
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
    /**
     * 
     * @param {integer} x - The x-coordinate of the mouse, relative to the inside of the Canvas element
     * @param {integer} y - The y-coordinate of the mouse, relative to the inside of the Canvas element
     * @returns {integer} - returns index of grid within Canvas.grids, or null if no grid is found
     */
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