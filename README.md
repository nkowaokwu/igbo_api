# Igbo API
[![Deploy to Firebase](https://github.com/nkowaokwu/igbo_api/actions/workflows/deploy.yml/badge.svg)](https://github.com/nkowaokwu/igbo_api/actions/workflows/deploy.yml) [![Dockerize Igbo API](https://github.com/nkowaokwu/igbo_api/actions/workflows/dockerize.yml/badge.svg)](https://github.com/nkowaokwu/igbo_api/actions/workflows/dockerize.yml)

[Contributing](./.github/CONTRIBUTING.md) | [Documentation](https://igboapi.com/docs) | [Code of Conduct](./.github/CODE_OF_CONDUCT.md) | [Slack Channel](https://igboapi.slack.com)

> Igbo is the principal native language of the Igbo people, an ethnic group of southeastern Nigeria, and is spoken by approx 45 million people with more than 20 different dialects.

## Features 🧱
📚 4,500+ Igbo words, 5,000+ dialectal variations, 17,000+ Igbo example sentences

✍🏾 English and Igbo definitions

🗣 Audio pronunciations for words and examples

🔎 Full-text search with diacritic support

🚀 [Try out a demo here](https://igboapi.com)

## Getting Started

Let's get the Igbo API running locally on your machine.

### 0. Prerequisites

To run this project locally, the following tools need to be installed:

* [Node.js](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)
* [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
* [Firebase](https://console.firebase.google.com/)
* [Java](https://www.oracle.com/java/technologies/downloads/)
* [NVM](https://github.com/nvm-sh/nvm)

### 1. Installation

Clone the project:

```
git clone https://github.com/nkowaokwu/igbo_api.git
```

**Note:** It's recommended to have [NVM](https://github.com/nvm-sh/nvm) installed so you can easily switch
between Node versions that are required in this project.

Navigate into the project directory and install its dependencies:

```
cd igbo_api/
yarn install
```

Build the frontend for the site:

```
yarn build
```

### 2. Connect Firebase Project

This project uses Firebase and requires you to create your own free Firebase project.

Please follow the [Firebase Configuration Guide here](./.github/FIREBASE_CONFIG.md)

### 3. Local Development

Once you've configured your project, you can start the Igbo API dev server by running:

```
yarn dev
```

Navigate to [localhost:8080](http://localhost:8080/) to see the API

### Optional: Development with Replica Sets and Redis

To start the dev API server while running [MongoDB Replica sets](https://docs.mongodb.com/manual/replication/) and the [Redis cache](https://redis.io/), run:

```
yarn dev:full
```

To start a Redis server, run:
```
redis-server
```

**Warning**: Running replica sets locally is machine intensive and should only
be ran for testing or specific-feature development purposes.

**Reminder**: You must have Redis installed on your machine in order to run the server.

### Docker

If you don't want to run a local Node and MongoDB, you can use [Docker](https://docker.com)

Run the following command:

```
yarn start:docker
```

Navigate to [localhost:8080](http://localhost:8080) to see the API

### API Site

To start up the front site for the API, run:

```
yarn dev:site
```

Navigate to [localhost:3000](http://localhost:3000) to see the API front site

## Seeding 🌱

To populate the database complete the following steps:

### Option 1. Build a Dictionary

The following command places the JSON dictionaries in the `build/` directory:

```
yarn build:dictionaries
```

Here's an example JSON dictionary file: [ig-en/ig-en_expanded.json](./src/dictionaries/ig-en/ig-en_expanded.json)

### Option 2. Populate the MongoDB Database

Now that the data has been parsed, it needs to be used to populate, or seed, the MongoDB database.

Start the development server:

```
yarn dev
```

Then make a `POST` request to the following route:

```
/api/v1/test/populate
```

For example:

```
http://localhost:8080/api/v1/test/populate // POST
```

After about 20 seconds, if you see the `✅ Seeding successful.` message in your terminal, then you have successfully populated your database.

### 3. (Optional) Migrate Data

The database has gone through a number of migrations since the beginning of this project. To ensure that local testing data is the same
shape as the data in the production MongoDB database, run all MongoDB migration scripts with the following command:

```
yarn migrate-up
```

## Testing

### Frontend

Frontend tests focus specifically on the Igbo API homepage using Cypress. First, run:

```
yarn build
```

To watch frontend tests, run:

```
yarn cypress
```

### Backend

Backend tests use both locally stored MongoDB and JSON data, so to spin up an instance of MongoDB and start the tests at the same time, run:

```
yarn test
```

If you want to run your MongoDB instance and tests in separate terminals, you can run:


## Next Steps

Visit our 📚 [documentation website](https://igboapi.com/docs) to learn how to use the Igbo API within your own project.
