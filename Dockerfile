FROM node:18

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=8080
ENV CONTAINER_HOST=mongodb

EXPOSE 8080

CMD ["npm", "start"]