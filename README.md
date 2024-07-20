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

To run this project locally, please install the following:

- [Node.js](https://nodejs.org/en/download/)
- [Mongo for Windows](https://www.mongodb.com/docs/v3.0/tutorial/install-mongodb-on-windows/)
- [Mongo for Mac](https://www.mongodb.com/docs/v3.0/tutorial/install-mongodb-on-os-x/)
- [Firebase](https://console.firebase.google.com/)
- [Java](https://www.oracle.com/java/technologies/downloads/)
- [NVM](https://github.com/nvm-sh/nvm)
- [MongoDB Compass](https://docs.mongodb.com/manual/administration/install-community/) (Optional)

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
npm install
```

Build the frontend for the site:

```
npm run build
```

### 2. Connect Firebase Project

This project uses Firebase and requires you to create your own free Firebase project.

Please follow the [Firebase Configuration Guide here](./.github/FIREBASE_CONFIG.md)

### 3. Local Development

Once you've configured your project, you can start the Igbo API dev server by running:

```
npm run dev
```

Navigate to [localhost:3000](http://localhost:3000/) to see the UI.

Use [localhost:8080/igbo-api-staging-99a67/us-central1/api/api](http://localhost:8080/igbo-api-staging-99a67/us-central1/api/api) to access the API.

### Optional: Development with Replica Sets and Redis

To start the dev API server while running [MongoDB Replica sets](https://docs.mongodb.com/manual/replication/) and the [Redis cache](https://redis.io/), run:

```
npm run dev:full:database
```

To start a Redis server, run:

```
redis-server
```

**Warning**: Running replica sets locally is machine-intensive and should only
be ran for testing or specific-feature development purposes.

**Reminder**: You must have Redis installed on your machine in order to run the server.

### Project Start-Up Alternative: Docker

If you don't want to run a local Node and MongoDB, you can use [Docker](https://docker.com)

Run the following command:

```
npm run start:docker
```

Navigate to [localhost:8080](http://localhost:8080) to see the API

## Seeding the Database 🌱

To populate the database complete the following steps:

### Option 1. Build a Dictionary

The following command places the JSON dictionaries in the `build/` directory:

```
npm run build:dictionaries
```

Here's an example JSON dictionary file: [ig-en/ig-en_expanded.json](./src/dictionaries/ig-en/ig-en_expanded.json)

### Option 2. Populate the MongoDB Database

Now that the data has been parsed, it needs to be used to populate, or seed, the MongoDB database.

Start the development server:

```
npm run dev
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

### Verify database seeding was successful

Install one of the options on your machine to view the seeded data

**Option 1:** Download MongoDB Compass
```
https://docs.mongodb.com/manual/administration/install-community/
```

**Option 2:** Install MongoDB VSCode extension
```
https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode
```

Connect to your local mongodb cluster using this connection:
```
mongodb://127.0.0.1:27017/igbo_api
```

### (Optional) Migrate Data

The database has gone through a number of migrations since the beginning of this project. To ensure that local testing data is the same
shape as the data in the production MongoDB database, run all MongoDB migration scripts with the following command:

```
npm run migrate-up
```

## Testing

### Frontend

Frontend tests focus specifically on the Igbo API homepage using Cypress. First, run:

```
npm run build
```

To watch frontend tests, run:

```
npm run cypress
```

### Backend

Backend tests use both locally stored MongoDB and JSON data, so to spin up an instance of MongoDB and start the tests at the same time, run:

```
npm run test
```

If you want to run your MongoDB instance and tests in separate terminals, you can run:

## Next Steps

Visit our 📚 [documentation website](https://igboapi.com/docs) to learn how to use the Igbo API within your own project.
