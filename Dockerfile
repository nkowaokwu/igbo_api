FROM node:16

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

ENV PORT=8080
ENV CONTAINER_HOST=mongodb

EXPOSE 8080

CMD ["yarn", "start"]