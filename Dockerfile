FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i -only=prod
COPY . .
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
