import Canvas from "./Canvas.js";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sleepTime = 16;

async function start(seed){
    const canvas = document.createElement("canvas");
    const root = document.getElementById("root");
    root.appendChild(canvas);
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    const canvasLogic = new Canvas(ctx, 1, 2, 2, seed);
    console.log(canvasLogic.grids);
    while(true){
        canvasLogic.grids.forEach(grid => grid.draw());
        await sleep(sleepTime);
    }
}
console.log("loading canvas.");
start("22");
