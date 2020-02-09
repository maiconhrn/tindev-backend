FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3333
CMD [ "yarn", "run", "dev"]