import Grid from "./Grid.js";
function draw(grid, ctx){
    /*
        loop through iamgeData, 1 pixel (4 integers) at a time
        choose a random value between 150-255 for each pixel (150 to make black/color easy to distinguish)
        set alpha to visible

        replaec current ImageData with newly created one.
    */
}

function* loop(lastgen, ctx){
    while(true){
        console.log("generating new field.");
        let next = new Grid(lastgen.width, lastgen.height, lastgen);
        //draw(next.grid, ctx);
        yield next;
    }
}

function start(seed){
    const root = document.getElementById("root");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    root.appendChild(canvas);
    //canvas.width = window.width;
    //canvas.height = window.height;
    const initial = new Grid(200, 300, seed);
    console.log("first grid created.");
    let generator = loop(initial);
    let next = generator.next();
    for(let i = 0; i < 5; i++){
        next = generator.next(next.value);
    }
    return null;
}
start("22");