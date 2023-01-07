import Canvas from "./Canvas.js";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sleepTime = 64;

async function start(seed){
    const canvas = document.createElement("canvas");
    canvas.id = "gol-canvas";
    document.onmouseup = (event) => {
        console.log(event.target.id);
        if(event.target.id !== "gol-canvas")
            document.getElementById("canvas-context-menu").style.visibility = "hidden";
    }
    const root = document.getElementById("root");
    root.appendChild(canvas);
    canvas.width = 800;
    canvas.height = 800;
    const canvasLogic = new Canvas(canvas, 12, 1, 1, seed);
    console.log(canvasLogic.grids);
    canvasLogic.grids.forEach(grid => grid.init());
    canvasLogic.SubdivideGrid(0);
    let colors = ["red", "green", "blue", "yellow"];
    canvasLogic.grids.forEach((grid, index) => grid.wipeField(colors[index]));
    /*canvasLogic.grids.forEach(grid => grid.draw(grid.grid));
    await sleep(500);
    while(true){
        canvasLogic.grids.forEach(grid => grid.age());
        await sleep(sleepTime);
    }*/
}
console.log("loading canvas.");
start("22");
