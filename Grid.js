import Cell from "./Cell.js";
import Rules from "./Rules.js";

export default class Grid {
    constructor(ctx, ctxSpace){
        this.ctx = ctx;
        this.ctxSpace = ctxSpace;
        this.width = this.ctxSpace.dx/(this.ctxSpace.size);
        this.height = this.ctxSpace.dy/(this.ctxSpace.size);
        
    }
    init(){ this.grid = this.#newGame(); }
    #newGame(){
        let grid = [];
        let seed = "22";
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
    getNeighbors(x, y, boolGrid){
        //console.log("Cell: "+[x, y]+" : "+boolGrid[y][x].alive);
        let temp = [];
        for(let z=y-1; z <= y+1; z++){
            if(z < 0 || z >= this.height){ continue; }
            for(let i = x-1; i <= x+1; i++){
                if(i < 0 || i >= this.width){ continue; }
                if(i === x && z === y){ continue; }
                temp.push(boolGrid[z][i]);
            }
        }
        //console.log("Neighbors: "+temp);
        return temp;
    }
    *#cellPixel(arr){
        for(let y=0; y < arr.length; y++){
            let xaxis = arr[y];
            for(let step=0; step < this.ctxSpace.size; step++){
                for(let x=0; x < xaxis.length; x++){
                    let cell = xaxis[x];
                    for(let z=step; z < cell.canvasPositions.length; z+=this.ctxSpace.size){
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
    wipeField(color){
        this.ctx.fillStyle = color ? color : "blue";
        console.log([this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy]);
        this.ctx.fillRect(this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy);
    }
}