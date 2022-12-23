import Rules from "./Rules.js";
const genColor = (min=150, max=255) => Math.floor(Math.random() * (max-min+1)) + min;
export default class Grid {
    constructor(ctx, ctxSpace, width, height, seed){
        this.ctx = ctx;
        this.ctxSpace  = ctxSpace;
        this.width  = width/(ctxSpace.size*ctxSpace.size);
        this.height  = height/(ctxSpace.size*ctxSpace.size);
        this.grid = this.#newGame(seed);
    }
    #newGame(seed){
        let grid = [];
        if(seed.length < 2)
            throw Error("Seed should be at least two integers long.");
        for(let x = 0; x < this.width; x++){
            grid[x] = [];
            for(let y=0; y < this.height; y++){
                let alive = x % seed[0] == 0 && y % seed[1] == 0;
                grid[x][y] = alive;
            }
        }
        return grid;
    }
    #newGeneration(){
        let grid = [];
        this.grid.forEach((yarr, x) => {
            grid[x] = [];
            yarr.forEach((cell, y) => grid[x][y] = Rules(cell, this.getNeighbors(x,y)));
        });
        return grid;
    }
    getNeighbors(x, y){
        let temp = [];
        for(let i = x-1; i < x+2; i++){
            if(i < 0 || i >= this.width){ continue; }
            for(let z=y-1; z < y+2; z++){
                if(z < 0 || z>= this.height){ continue; }
                if(i == x && z == y){ continue; }
                temp.push(this.grid[i][z]);
            }
        }
        return temp;
    }
    async draw(){
        let temp = this.#newGeneration();
        let imageData = this.ctx.getImageData(this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy);
        let next = this.ctx.createImageData(imageData);
        let pixels = [];
        temp.forEach((yarr, xindex) => {
            yarr.forEach((cell, yindex) => {
                let pixelColor = cell ? [genColor(), genColor(), genColor(), 255] : [0, 0, 0, 255];
                for(let i=xindex; i<xindex+this.ctxSpace.size; i++){
                    if(!pixels[i]){ pixels[i] = []; }
                    for(let z=yindex; z<yindex+this.ctxSpace.size; z++){
                        pixels[i][z] = pixelColor;
                        //let location = (xindex+i)*(yarr.length*4) + (yindex+z)*4;
                        //console.log([next.data[location], next.data[location+1], next.data[location+2], next.data[location+3]])
                        // go to every pixel location (coords are for ctx.ImageData). change each of the 4 pixels to the new color
                        //console.log("original: "+next.data[pixelLoc]+","+next.data[pixelLoc+1]+","+next.data[pixelLoc+2]+","+next.data[pixelLoc+3]+",");
                        //for(let j=0; j<4; j++){ next.data[location+j] = pixelColor[j]; }
                        //console.log("altered: "+next.data[pixelLoc]+","+next.data[pixelLoc+1]+","+next.data[pixelLoc+2]+","+next.data[pixelLoc+3]+",");
                    }
                }
            });
        });
        pixels = pixels.flat();
        pixels.forEach((pixel, index) => {
            next.data[index] = pixel[0];
            next.data[index+1] = pixel[1];
            next.data[index+2] = pixel[2];
            next.data[index+3] = pixel[3];
        });
        this.ctx.putImageData(next, this.ctxSpace.x, this.ctxSpace.y);
        this.grid = temp;
    }
    wipeField(){
        this.ctx.fillStyle = "black";
        console.log([this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy]);
        this.ctx.fillRect(this.ctxSpace.x, this.ctxSpace.y, this.ctxSpace.dx, this.ctxSpace.dy);
    }
}