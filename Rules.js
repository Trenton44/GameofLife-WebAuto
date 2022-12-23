export default function(cell, neighbors){
    let aliveN = neighbors.filter(ncell => ncell == true);
    if(cell && aliveN.length == 3 || aliveN.length == 2)
        return true;
    if(!cell && aliveN.length == 3)
        return true;
    return false;
}