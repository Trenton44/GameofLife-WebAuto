import Grid from "./Grid.js";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sleepTime = 16;

const genPixel = (min=150, max=255) => Math.floor(Math.random() * (max-min+1)) + min;
function draw(grid, ctx){
    let imageData = ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    let next = ctx.createImageData(imageData);
    let counter = 0;
    grid.forEach((arr, index) => {
        arr.forEach((cell, index) => {
            let pixel = cell ? [genPixel(), genPixel(), genPixel(), 255] : [0, 0, 0, 255];
            for(let i=0; i< pixel.length; i++){
                next.data[counter] = pixel[i];
                counter +=1;
            }
        });
    });
    ctx.putImageData(next, 0, 0);
}

async function start(seed){
    const root = document.getElementById("root");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    root.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const initial = new Grid(canvas.width, canvas.height, seed);
    draw(initial.grid, ctx);
    await sleep(sleepTime);
    console.log("first grid created.");
    let next = initial;
    while(true){
        next = new Grid(next.width, next.height, next);
        draw(next.grid, ctx);
        await sleep(sleepTime);
    }
}
start("22");