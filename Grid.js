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
        for(let y=0; y < this.height; y++){
            grid[y] = [];
            for(let x=0; x < this.width; x++){
                let alive = x % seed[0] == 0 && y % seed[1] == 0;
                grid[y][x] = new Cell(alive, x, y, this.ctxSpace.size);
            }
        }
        return grid;
    }
    newGeneration(){
        let temp = [...this.grid];
        temp.forEach((yarr, y) => 
            yarr.forEach((cell, x) => cell.alive = Rules(cell.alive, this.getNeighbors(x, y)))
        );
        return temp;
    }
    getNeighbors(x, y){
        let temp = [];
        for(let z=y-1; z < y+2; z++){
            if(z < 0 || z>= this.height){ continue; }
            for(let i = x-1; i < x+2; i++){
                if(i < 0 || i >= this.width){ continue; }
                if(i == x && z == y){ continue; }
                temp.push(this.grid[z][i].alive);
            }
        }
        return temp;
    }
    *#cellPixel(arr){
        for(let step=0; step < 2; step++){
            for(let y=0; y < arr.length; y++){
                let xaxis = arr[y];
                for(let x=0; x < xaxis.length; x++){
                    let cell = xaxis[x];
                    for(let z=step; z < cell.canvasPositions.length; z+=2){
                        yield cell.draw();
                    }
                }
            }
        }
        return true;
    }
    age(){
        let temp = this.newGeneration();
        this.draw(temp);
        this.grid = temp;
    }
    draw(frame){
        let imageData = this.ctx.getImageData(this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy);
        let nextImage = this.ctx.createImageData(imageData);
        let pixels = this.#cellPixel(frame);
        let next = pixels.next();
        let counter = 0;
        while(!next.done){
            //console.log("Before: "+[nextImage.data[counter], nextImage.data[counter+1], nextImage.data[counter+2],nextImage.data[counter+3] ]);
            nextImage.data[counter] = next.value[0];
            nextImage.data[counter+1] = next.value[1];
            nextImage.data[counter+2] = next.value[2];
            nextImage.data[counter+3] = next.value[3];
            //console.log("After: "+[nextImage.data[counter], nextImage.data[counter+1], nextImage.data[counter+2],nextImage.data[counter+3] ]);
            counter += 4;
            next = pixels.next();
        }
        this.ctx.putImageData(nextImage, this.ctxSpace.x, this.ctxSpace.y);
    }
    wipeField(){
        this.ctx.fillStyle = "black";
        console.log([this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy]);
        this.ctx.fillRect(this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy);
    }
}