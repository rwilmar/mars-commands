# mars-commands
Fun app to test commands to move a robot on a finite grid


## Install the app
The app is implemented in a REST API, for deployment in Node.js environments just download the folder and install using the npm installer
```
$ npm install 
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