# mars-commands
Fun app to test commands to move a robot on a finite grid


## Install the app
The app is implemented in a REST API, for deployment in Node.js environments just download the folder and install using the npm installer
```
$ npm install 
```

## mars-commands API REST Endpoints

### GET home  127.0.0.1:3000/
test the api for correct function

### GET robotPosition 127.0.0.1:3000/robotPosition
gets the robot position, use robotId as a query parameter to request for non default robots
Query Params: 
- robotId

### POST set world size  127.0.0.1:3000/worldSize
Set world size, body example
```
{
  "command": "5 3",
  "yMax": 5,
  "xMax": "3"
}
```

### GET get world size 127.0.0.1:3000/worldSize
get world size, example: 
```
{ "xMin": 0, "xMax": 0, "yMin": 0, "yMax": 0 }
```

### POST landRobot 127.0.0.1:3000/landRobot
land a robot, or relocate it manually, you can either use cmd coordinates attaching in the body "position".
```
{
  "position": "10 10 N"
}
```
or object notation with {xPos, yPos, orientation}
```
{
  "xPos": "98",
  "yPos": "9",
  "orientation": "S"
}
```

### POST landAndMove 127.0.0.1:3000/landAndMove
land and move the robot in one command using command line
```
{
  "position": "0 3 W",
  "command": "LLFFFRFLFL"
}
```

### POST moveRobot 127.0.0.1:3000/landAndMove
move robot using the current robot position as origin,
```
{
  "command": "LLFFFRFLFL"
}
```


## Running the server
if running from the command line and you're browsing the app directory just run the default module.
```
$ node .
```
## Docker deployment
if you are planning to use docker, an image can be generated and then run by the docker usual commands, the default port of deployment is 3000,
```
$ docker build . -t rwilmar/marscommands
$ docker run --name marsCommands --port 3000:3000 rwilmar/marscommands 
```