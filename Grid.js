import Rules from "./rules.js";

export default class Grid {
    constructor(width, height, seed){
        this.width = width;
        this.height = height;
        this.grid = seed instanceof Grid ?
            Grid.constructGridGeneration(seed) :
            Grid.constructGrid(this.width, this.height, seed);
    }
    static constructGrid(width, height, seed){
        let grid = [];
        if(seed.length < 2)
            throw Error("Seed should be at least two integers long.");
        for(let x = 0; x < width; x++){
            grid[x] = [];
            for(let y=0; y < height; y++){
                let alive = x ^ seed[0] == 0 && y % seed[1] == 0;
                grid[x][y] = alive;
            }
        }
        return grid;
    }
    static constructGridGeneration(seed){
        let grid = [];
        seed.grid.forEach((arr, x) => {
            grid[x] = [];
            arr.forEach((cell, y) => grid[x][y] = Rules(cell, seed.getNeighbors(x,y)));
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
    addRow(){}
    addColumn(){}
}