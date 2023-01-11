import Cell from "./Cell.js";
import Rules from "./Rules.js";
const GCD = (a, b) => b == 0 ? a : GCD(b, a%b);
const Ratio = (width, height) => {
    let gcd = GCD(width, height);
    //ratio.forEach(pos => pos = Math.sqrt(pos) % 1 == 0 ? Math.sqrt(pos) : pos);
    return [width/gcd, height/gcd];
};

/**
 * Class Representing Grid Instances
 * Maintain GoL state and convert cell grid to pixels for Canvas to render
 */
export default class Grid {
    /**
     * 
     * @param {HTMLCanvasContext} ctx - the 2d context of the parent HTMLCanvas
     * @param {Object} ctxSpace - Canvas Coordinates passed from parent Canvas instance
     */
    constructor(ctx, ctxSpace){
        this.ctx = ctx;
        this.ctxSpace = ctxSpace;
        // find GCD of Grid width/height, divide to get the ratio of x-pixels -> y-pixels for each cell
        this.cellSize = Ratio(this.ctxSpace.dx, this.ctxSpace.dy);
        // Get position of Grid within the Canvas space
        this.pos = [this.ctxSpace.x/(this.cellSize[0]), this.ctxSpace.y/(this.cellSize[1])];
        this.name = "Grid "+this.pos[0]+" : "+this.pos[1];
        this.width = this.ctxSpace.dx/(this.cellSize[0]);
        this.height = this.ctxSpace.dy/(this.cellSize[1]);
        this.effects = {};
    }
    /**
     * Initialize the game by filling Cells with values
     */
    init(){ this.grid = this.#newGame(); }
    /**
     * fills grid with 2d array [height][width] with Cell instances
     * @returns {Object[Grid.height][Grid.width]} - GoL grid containing Cells
     */
    #newGame(){
        let grid = [];
        let seed = "22";
        for(let y=0; y < this.height; y++){
            grid[y] = [];
            for(let x=0; x < this.width; x++){
                let alive = x % seed[0] == 0 && y % seed[1] == 0;
                grid[y][x] = new Cell(alive, x, y, this.cellSize);
            }
        }
        return grid;
    }
    /**
     * Changes status of Cells, given the ruleset of the GoL
     * @returns {Grid.grid}
     */
    newGeneration(){
        let temp = [];
        this.grid.forEach((yarr, y) => {
            temp[y] = [];
            yarr.forEach((cell, x) => temp[y][x] = cell.alive);
        });
        this.grid.forEach((yarr, y) => {
            yarr.forEach((cell, x) => cell.alive = Rules(cell.alive, this.getNeighbors(x, y, temp)));
        });
        return this.grid;
    }
    /**
     * Takes a generation's cell values and the x,y coords of the desired cell, returns the values of that cell's neighbors
     * @param {integer} x 
     * @param {integer} y 
     * @param {boolean[]} boolGrid 
     * @returns 
     */
    getNeighbors(x, y, boolGrid){
        let temp = [];
        for(let z=y-1; z <= y+1; z++){
            if(z < 0 || z >= this.height){ continue; }
            for(let i = x-1; i <= x+1; i++){
                if(i < 0 || i >= this.width){ continue; }
                if(i === x && z === y){ continue; }
                temp.push(boolGrid[z][i]);
            }
        }
        return temp;
    }
    /**
     * Generator function for rendering each Cell to the Canvas ImageData array.
     * 
     * @param {Cell[]} arr 
     * @yields {Cell}
     * @returns 
     */
    *#cellPixel(arr){
        for(let y=0; y < arr.length; y++){
            let xaxis = arr[y];
            for(let step=0; step < this.cellSize[0]; step++){
                for(let x=0; x < xaxis.length; x++){
                    let cell = xaxis[x];
                    for(let z=step; z < cell.canvasPositions.length; z+=this.cellSize[0]){
                        yield cell.draw();
                    }
                }
            }
        }
        return true;
    }
    /**
     * Ages the GoL grid to next generation, calls Grid.draw()
     */
    age(){
        let temp = this.newGeneration();
        this.draw(temp);
        this.grid = temp;
    }
    /**
     * Pulls pixel values of each cell and writes them to ImageData[] for this Grid instance's Canvas area.
     * @param {Grid.grid} frame - the grid to be drawn to canvas. passed automatically via Grid.age()
     */
    draw(frame){
        let imageData = this.ctx.getImageData(this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy);
        let nextImage = this.ctx.createImageData(imageData);
        let pixels = this.#cellPixel(frame);
        let next = pixels.next();
        let counter = 0;
        while(!next.done){
            nextImage.data[counter] = next.value[0];
            nextImage.data[counter+1] = next.value[1];
            nextImage.data[counter+2] = next.value[2];
            nextImage.data[counter+3] = next.value[3];
            //console.log("Before: "+[nextImage.data[counter], nextImage.data[counter+1], nextImage.data[counter+2],nextImage.data[counter+3] ]);
            Object.entries(this.effects).forEach(([effect, func]) => {
                func(nextImage.data, [counter, counter+1, counter+2, counter+3]);
            });
            //console.log("After: "+[nextImage.data[counter], nextImage.data[counter+1], nextImage.data[counter+2],nextImage.data[counter+3] ]);
            counter += 4;
            next = pixels.next();
        }
        this.ctx.putImageData(nextImage, this.ctxSpace.x, this.ctxSpace.y);
    }
    /**
     * Returns count of all living/dead cells in game
     * @param {boolean} type - true=living/false=dead
     * @returns {integer}
     */
    getCells(type){
        let counter = 0;
        this.grid.forEach(cell => {
            if(cell.alive == type)
                counter += 1;
        });
        return counter;
    }
    /**
     * Wipes the Grid's canvas coordinates with a color
     * @param {String} color - defaults to blue
     */
    wipeField(color="blue"){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy);
    }
}