import express from 'express';
import {
  getRobotLocation,
  setRobotLocation,
  posCmdValidator,
  posObjValidator,
  commandValidator,
} from './robotLocator.js';
import { saveCommand } from './persistence.js';
import { getWorldCoords, setWorldMaxCoord } from './worldState.js';

const getUser = () => 'default_user'; 
const getSession = () => new Date().toISOString().substring(0,10);


/**
 * @typedef RobotPosition
 * @type {object}
 * @property {number} xPos - x-axis position
 * @property {number} yPos - y-axis position
 */


const APP_PORT = 3000;

const app = express()
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


const welcomeMessage = (req, res) => {
  res.status(200).send({ message: "Welcome to the Mars-Command API." });
};


/**
 * endpoint for setting the size of the grid surface
 * @param {object} req - express request object
 * @param {object} req.body - express body object
 * @param {number} req.body.xMax - integer size of grid in x axis
 * @param {number} req.body.yMax - integer size of grid in y axis
 * @returns {Promise<void>} 
 */
const setWorldSize = (req, res) => {
  let xMax = req.body.xMax;
  let yMax = req.body.yMax;
  const command = req.body.command;
  try{
    if((!req.body.xMax || !req.body.yMax) && !command){
      throw new Error('no command or coordinates (xMax, yMax) found ')
    } 
    if(command){
      const arrSize = command.split(' ');
      if(arrSize.length!=2){
        throw new Error('invalid number of arguments, (xMax, yMax) expected');
      }
      xMax = parseInt(arrSize[0]);
      yMax = parseInt(arrSize[1]);
    }

    setWorldMaxCoord(xMax, yMax)
    res.send({ 
      message: 'new size set for world',
      worldSize: getWorldCoords(),
    })
  }
  catch(err){
    res.status(500).send('error processing movement: ' + err.message);
  }
}

/**
 * endpoint for landing a robot on the grid surface
 * @param {object} req - express request object
 * @param {object} req.body - express body object
 * @param {string} req.body.posString - string defining position for landing ,¡.e ('1 1 E')
 * @param {number} req.body.cmdString - string defining a series of valid movements 
 * @param {number} [req.body.robotId] - numeric position for y axis 
 */
 const landAndMoveRobot = async (req, res) => {
  const posString = req.body.position;
  const cmdString = req.body.command;
  const robotId = req.body.robotId||'default';
  try{
    if(!posString || !cmdString)
      throw new Error('incomplete parameters, position and command are mandatory')

    const posObj = posCmdValidator(posString);
    await setRobotLocation(posObj, robotId);
    await saveCommand(posObj, '--LAND', robotId, getUser(), getSession());

    //TODO move
    const valMov = commandValidator(cmdString)
    return res.send({
      message: 'robot landed',
      robotId,
      currentPosition: posObj
    })

  }
  catch(err){
    res.status(500).send('error processing movement: ' + err.message);
  }
}

/**
 * endpoint for landing a robot on the grid surface
 * @param {object} req - express request object
 * @param {object} req.body - express body object
 * @param {string} [req.body.posString] - string defining position for landing i,¡.e ('1 1 E')
 * @param {number} [req.body.xPos] - numeric position for x axis
 * @param {number} [req.body.yPos] - numeric position for y axis
 * @param {number} [req.body.orientation] - orientation (valid char: N, E, S, W) 
 */
const landRobot = async (req, res) => {
  const posString = req.body.position;
  const xPos = req.body.xPos;
  const yPos = req.body.yPos;
  const orientation = req.body.orientation;
  const robotId = req.body.robotId||'default';
  try{
    let posObj = null;
    if(posString){
      posObj = posCmdValidator(posString);
    }
    else{
      posObj = posObjValidator({
        xPos,
        yPos,
        orientation
      })
    }
    await setRobotLocation(posObj, robotId);
    await saveCommand(posObj, '--LAND', robotId, getUser(), getSession());
    return res.send({
      message: 'robot landed',
      robotId,
      currentPosition: posObj
    })
  }
  catch(err){
    res.status(500).send('error processing movement: ' + err.message);
  }
}


app.get('/', welcomeMessage);
app.get('/worldSize', (req, res) => { res.send(getWorldCoords()) });
app.post('/worldSize', setWorldSize)
app.post('/landAndMove', landAndMoveRobot);
app.post('/landRobot', landRobot);

app.listen(APP_PORT, () => {
  console.log(`Mars-Robot movement App listening on port: ${APP_PORT}`)
})

