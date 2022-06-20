FROM node:16

#Create directory
WORKDIR /usr/src/marsCommandsApp

#install dependencies
COPY package*.json ./
RUN nmp install --only=production

#bundle app source code
COPY . .

EXPOSE 3000
CMD ["node", "index.js" ]