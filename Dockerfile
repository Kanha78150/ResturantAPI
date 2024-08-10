FROM node:latest
RUN npm install -g nodemon
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD [ "node","server.js"]