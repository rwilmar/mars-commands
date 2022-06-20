

const worldCoordinates = {
    xMin:0,
    xMax:0,
    yMin:0,
    yMax:0,
}

export const getWorldCoords = () =>{
    return worldCoordinates
}

export const setWorldMaxCoord = (xMaxVar, yMaxVar) => {
    const xMax = parseInt(xMaxVar);
    const yMax = parseInt(yMaxVar);
    if(isNaN(xMax) || isNaN(yMax)){
      throw new Error('invalid numbers for size in: xMax or yMax');
    }
    if(worldCoordinates.xMin>xMax){
        throw new Error('invalid size xMax');
    }
    if(worldCoordinates.yMin>yMax){
        throw new Error('invalid size for yMax');
    }
    worldCoordinates.xMax = xMax;
    worldCoordinates.yMax = yMax;
}