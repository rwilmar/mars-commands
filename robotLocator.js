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
 * return current robot location
 * @param {string} [robotId] - robot identificator 
 * @returns {RobotPosition}
 */
export const getRobotLocation = async (robotId = 'default') => {
  const obj = dbStates.get(robotId);
  if(!obj){
    const newPos = {
      xPos: 0, 
      yPos: 0,
      orientation: 'N'
    };
    dbStates.set(robotId, newPos);
    return newPos;
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
      throw new Error('invalid movement detected: '+ch);
  }
  return cmd;
}