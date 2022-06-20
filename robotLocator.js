import { dbStates } from './persistence.js';
import { getWorldCoords } from './worldState.js';

const VALID_ORIENTATIONS = ['N', 'S', 'E', 'W'];
const VALID_MOVEMENTS = ['L', 'R', 'F'];


/**
 * @typedef RobotPosition
 * @type {object}
 * @property {number} xPos - x-axis position
 * @property {number} yPos - y-axis position
 * @property {string} orientation - head orientation of robot 'N','S','E','W'
 */

/**
 * return current robot location, throw error if robot inexistent
 * @param {string} [robotId] - robot identificator 
 * @returns {Promise<RobotPosition>}
 */
export const getRobotLocation = async (robotId = 'default') => {
  const obj = dbStates.get(robotId);
  if(!obj){
    throw new Error('robot not found in the surface')
    // const newPos = {
    //   xPos: 0, 
    //   yPos: 0,
    //   orientation: 'N'
    // };
    // dbStates.set(robotId, newPos);
    // return newPos;
  }
  return obj;
}

/**
 * set current robot position
 * @param {RobotPosition} position 
 * @param {string} robotId 
 */
export const setRobotLocation = async (position, robotId = 'default') => {
  const worldCoords = getWorldCoords();
  if(position.xPos>worldCoords.xMax || position.xPos<worldCoords.xMin){
    throw new Error ('robot out of world in x-axis')
  }
  if(position.yPos>worldCoords.yMax || position.yPos<worldCoords.yMin){
    throw new Error ('robot out of world in y-axis')
  }
  const newPos = {
    xPos: position.xPos, 
    yPos: position.yPos,
    orientation: position.orientation,
  }
  dbStates.set(robotId, newPos);
}

/**
 * validates and return a robot position from a command line, throws error if invalid
 * @param {string} posCmd - command line string (example: '1 1 E')
 * @returns {RobotPosition}
 */
 export const posCmdValidator = (posCmd) => {

  if (typeof(posCmd) !== 'string')
    throw new Error('invalid position, data is not string');
  const arrPos = posCmd.split(' ');
  if(arrPos.length!=3){
    throw new Error('invalid number of arguments, (xPos yPos orientation) expected');
  }
  
  return posObjValidator({
    xPos: arrPos[0],
    yPos: arrPos[1],
    orientation: arrPos[2]
  })
}

/**
 * validates and return a position object.
 * @param {RobotPosition} posObj - non validated position object 
 * @returns {RobotPosition}
 */
export const posObjValidator = (posObj) => {
  const xPos = parseInt(posObj.xPos);
  const yPos = parseInt(posObj.yPos);
  const orientation = posObj.orientation;
  if(isNaN(xPos) || isNaN(yPos))
    throw new Error('position for x or y axis is invalid ['+ posObj.xPos +', '+ posObj.yPos +']');
  if(!VALID_ORIENTATIONS.includes(orientation))
    throw new Error('orientation invalid');
  return {
    xPos,
    yPos,
    orientation,
  }
}

/**
 * validates and return robot instruction list, throws error if invalid
 * @param {string} cmd - command line string 
 * @returns {string}
 */
export const commandValidator = (cmd) => {
  if (typeof(cmd) !== 'string'){
    throw new Error('command movements have a wrong format (string spected)');
  }
  for(const ch of cmd){
    if(!VALID_MOVEMENTS.includes(ch))
      throw new Error('invalid movement detected: -'+ch+'-');
  }
  return cmd;
}

/**
 * moves a robot in the surface and returns a final position,if moved out of grid throws error
 * @param {string} cmdString - pre-validated command movement for robot 
 * @param {string} [robotId] - robot id (defaults to 'default')
 * @returns {RobotPosition}
 */
export const moveRobot = async (cmdString, robotId='default') => {
  let {xPos, yPos, orientation} = await getRobotLocation(robotId);

  for(const cmd of cmdString){
    const newDirection = degreesToDir(dirEnum[orientation] + turnDegrees[cmd]);
    orientation = newDirection;
    if(cmd == 'F'){
      if(newDirection=='N'){
        yPos+=1;
      }else if(newDirection=='S'){
        yPos-=1;
      }else if(newDirection=='E'){
        xPos+=1;
      }else if(newDirection=='W'){
        xPos-=1;
      }
    }
    await setRobotLocation({xPos, yPos, orientation}, robotId);
  }
  return {xPos, yPos, orientation};
}

const dirEnum = {
  N: 0,
  E: 90,
  S: 180,
  W: 270
}

const turnDegrees = {
  L: -90,
  R: 90,
  F: 0,
}

/**
 * converts degrees to direction (N, S, E, W) rounds to the nearest pole.
 * @param {number} degrees - number of degrees for direction vestor
 * @returns {string}
 */
const degreesToDir = (degrees) =>{
  if(degrees>=360)
    return degreesToDir(degrees-360);
  if(degrees<0)
    return degreesToDir(degrees+360);
  
  if(degrees>=315 || degrees<45)
    return 'N' 
  if(degrees>=225 && degrees<315)
    return 'W'
  if(degrees>=135 && degrees<225)
    return 'S' 
  if(degrees>=45 && degrees<135)
    return 'E'
}