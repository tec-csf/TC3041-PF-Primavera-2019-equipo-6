FROM node:8

#Defining working directory
WORKDIR /app

#Install dependencies
COPY package*.json ./
RUN npm install

#Add application code
COPY . .

#Start app
EXPOSE 8001
CMD [ "npm", "start" ]
