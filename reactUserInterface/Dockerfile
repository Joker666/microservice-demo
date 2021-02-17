FROM node:14

# Create app directory
WORKDIR /app

# Install app dependencies
#RUN npm install webpack -g
# Update container and install deps
RUN apt-get update && apt-get install -y build-essential
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./
COPY . ./
RUN npm install --quiet
#RUN npm uninstall node-sass -g
#RUN npm install node-sass -g
#RUN npm rebuild node-sass
#RUN npx browserslist@latest --update-db
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
#COPY . ./

#CMD ./node_modules/.bin/webpack-dev-server --hot --inline --config ./webpack.config.js --host 0.0.0.0

EXPOSE 3000
CMD [ "npm", "start" ]