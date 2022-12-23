import Cell from "./Cell.js";
import Rules from "./Rules.js";

export default class Grid {
    constructor(ctx, ctxSpace, width, height, seed){
        this.ctx = ctx;
        this.ctxSpace = ctxSpace;
        this.width = width/(this.ctxSpace.size*this.ctxSpace.size);
        this.height = height/(this.ctxSpace.size*this.ctxSpace.size);
        this.grid = this.#newGame(seed);
    }
    #newGame(seed){
        let grid = [];
        if(seed.length < 2)
            throw Error("Seed should be at least two integers long.");
        for(let x = 0; x < this.width; x++){
            grid[x] = [];
            for(let y = 0; y < this.height; y++){
                let alive = x % seed[0] == 0 && y % seed[1] == 0;
                grid[x][y] = new Cell(alive, x, y, this.ctxSpace.size, this.width);
            }
        }
        return grid;
    }
    #newGeneration(){
        let temp = [...this.grid];
        temp.forEach((yarr, x) => 
            yarr.forEach((cell, y) => cell.alive = Rules(cell.alive, this.getNeighbors(x, y)))
        );
        return temp;
    }
    getNeighbors(x, y){
        let temp = [];
        for(let i = x-1; i < x+2; i++){
            if(i < 0 || i >= this.width){ continue; }
            for(let z=y-1; z < y+2; z++){
                if(z < 0 || z>= this.height){ continue; }
                if(i == x && z == y){ continue; }
                temp.push(this.grid[i][z].alive);
            }
        }
        return temp;
    }
    async draw(){
        let temp = this.#newGeneration();
        let imageData = this.ctx.getImageData(this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy);
        let next = this.ctx.createImageData(imageData);
        temp.forEach((yarr, xindex) => 
            yarr.forEach((cell, yindex) => cell.draw(next.data, temp.length, yarr.length))
        );
        this.ctx.putImageData(next, this.ctxSpace.x, this.ctxSpace.y);
        this.grid = temp;
    }
    wipeField(){
        this.ctx.fillStyle = "black";
        console.log([this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy]);
        this.ctx.fillRect(this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy);
    }
}