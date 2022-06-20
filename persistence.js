import JSONdb from 'simple-json-db'
import path from 'path';

const dbHistoryDir = path.resolve('.', 'history.json');
const dbStateDir = path.resolve('.', 'state.json');
const dbHistory = new JSONdb(dbHistoryDir);
export const dbStates = new JSONdb(dbStateDir);

/**
 * saves a command movement in the history command storage db
 * @param {RobotPosition} origin - origin position of robot {xPos, yPos}
 * @param {string} cmdString - save a history register of command
 * @returns {Promise<void>}
 */
export const saveCommand = async (origin, cmdString, robotId='default', user='api', session=null) => {
  const reg = {
    robot: robotId,
    origin,
    cmd: cmdString,
    timestamp: new Date().getTime(),
    user,
  };
  let history = dbHistory.get(session);

  if(!history){
    history = [];
  }
  dbHistory.set(session, [...history, reg] );
}

