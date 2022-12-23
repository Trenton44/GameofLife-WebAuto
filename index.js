import Canvas from "./Canvas.js";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sleepTime = 16;

async function start(seed){
    const canvas = document.createElement("canvas");
    const root = document.getElementById("root");
    root.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const canvasLogic = new Canvas(ctx, 1, 2, 1, seed);
    console.log(canvasLogic.grids);
    canvasLogic.grids.forEach(grid => grid.draw());
    /*while(true){
        console.log("rendering");
        canvasLogic.grids.forEach(grid => grid.draw());
        await sleep(500);
    }*/
}
console.log("loading canvas.");
start("22");
