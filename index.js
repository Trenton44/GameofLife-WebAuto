import Canvas from "./Canvas.js";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sleepTime = 64;

async function start(seed){
    const canvas = document.createElement("canvas");
    const root = document.getElementById("root");
    root.appendChild(canvas);
    canvas.width = 802;
    canvas.height = 802;
    const ctx = canvas.getContext("2d");
    const canvasLogic = new Canvas(ctx, 1, 2, 1, seed);
    console.log(canvasLogic.grids);
    canvasLogic.grids.forEach(grid => grid.draw(grid.grid));
    while(true){
        canvasLogic.grids.forEach(grid => grid.age());
        await sleep(sleepTime);
    }
}
console.log("loading canvas.");
start("22");
