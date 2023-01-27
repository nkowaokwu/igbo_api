# Igbo API
[![Deploy to Firebase](https://github.com/nkowaokwu/igbo_api/actions/workflows/deploy.yml/badge.svg)](https://github.com/nkowaokwu/igbo_api/actions/workflows/deploy.yml) [![Dockerize Igbo API](https://github.com/nkowaokwu/igbo_api/actions/workflows/dockerize.yml/badge.svg)](https://github.com/nkowaokwu/igbo_api/actions/workflows/dockerize.yml)

[Contributing](./.github/CONTRIBUTING.md) | [Documentation](https://github.com/nkowaokwu/igbo_api/wiki) | [Code of Conduct](./.github/CODE_OF_CONDUCT.md) | [Slack Channel](https://igboapi.slack.com)

> Igbo is the principal native language of the Igbo people, an ethnic group of southeastern Nigeria, and is spoken by approx 45 million people with more than 20 different dialects.

The initial dataset, including the words, word classes, definitions, and more, were based on the Columbia University published dictionary, [*Dictionary of Ònìchà Igbo*](http://www.columbia.edu/itc/mealac/pritchett/00fwp/igbo/IGBO%20Dictionary.pdf).

## Try it Out
**For a demo, check out this link [https://igboapi.com](https://www.igboapi.com)**

## Getting Started

Let's get the Igbo API running locally on your machine.

### Prerequisites

To run this project locally, the following tools need to be installed:

* [Node.js](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)
* [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
* [Firebase](https://console.firebase.google.com/)

### Installation

Clone the project:

```
git clone https://github.com/nkowaokwu/igbo_api.git
```

Navigate into the project directory and install it's dependencies:

```
cd igbo_api/
yarn install
```

Build the frontend for the site:

```
yarn build
```

### Connect Firebase Project

This project relies on Firebase Cloud Functions to execute the API dictionary logic along side host our website.

To ensure this project stays open source, it requires that individual contributors integrate their own Firebase project for local development.

#### Step 1: Create a Firebase Project

Please follow this [Firebase Getting Started Guide](https://firebase.google.com/docs/web/setup) to create your own Firebase project.

#### Step 2: Replace the `default` Firebase Project Name

Within [.firebaserc](https://github.com/nkowaokwu/igbo_api/blob/master/.firebaserc), replace the project name `igbo-api-bb22d` with your new Firebase project name

#### Step 3: Replace the Firebase Config file

Within [firebase.js](https://github.com/nkowaokwu/igbo_api/blob/master/src/services/firebase.js#L5-L13), replace the `FIREBASE_CONFIG` object with your firebase project config object

### Local Development

Once you've configured your prpoject, you can start the Igbo API dev server by running:

```
yarn dev
```

Navigate to [localhost:8080](http://localhost:8080/) to see the API

**Development with Replica Sets and Redis**:

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

## Usage

### Documentation

#### Development
After starting the API server with this `yarn dev`, visit `http://localhost:8080/docs`.

#### Production
You can also view the productions docs by visiting `https://igboapi.com/docs`.

### MongoDB Data

The database will initially be empty, meaning that no words will be returned from the API. To populate your local MongoDB database, read through [Locally Populating Dictionary Data](#populating-data)

### GET words

This route will let you pass in either Igbo or English to get Igbo word information.

```
/api/v1/words?keyword=<keyword>
```

For example:

```
// Igbo
http://localhost:8080/api/v1/words?keyword=agụū

// English
http://localhost:8080/api/v1/words?keyword=hunger
```

For responses with more than 10 words, you can paginate through them by using:

```
/api/v1/words?keyword=<keyword>&page=<page>
```

For example:

```
http://localhost:8080/api/v1/words?keyword=agụū&page=1
```

You can also search for examples using:

```
/api/v1/examples?keyword<keyword>&page=<page>
```

### JSON Data

If you don't want the API to serve the word data from MongoDB, you can use the follow route to get the words that are stored in the **JSON dictionary**:

```
/api/v1/test/words?keyword=<keyword>
```

For example:

```
http://localhost:8080/api/v1/test/words?keyword=agụū
```

The responses for both routes will be a plain JSON object similar to this:

```json
[
    {
        "wordClass": "noun",
        "definitions": [
            "hunger; desire; eagerness"
        ],
        "examples": [],
        "phrases": {
            "(agụū) -gụ": {
                "definitions": [
                    "be hungry"
                ],
                "examples": []
            },
            "agụū mmīli": {
                "definitions": [
                    "thirst"
                ],
                "examples": []
            },
            "-gụ agụū": {
                "definitions": [
                    "hunger; desire; long for ( -gụ 2. desire)"
                ],
                "examples": []
            }
        }
    }
]
```

<h2 id="populating-data">Locally Populating Dictionary Data</h2>

To populate the database complete the following steps:

### 1. Build a Dictionary

The following command places the JSON dictionaries in the `build/` directory:

```
yarn build:dictionaries
```

Here's an example JSON dictionary file: [ig-en/ig-en_expanded.json](./src/dictionaries/ig-en/ig-en_expanded.json)

### 2. Populate the MongoDB Database

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

### 3. Migrate Data (Optional)

The database has gone through a number of migrations since the beginning of this project. To ensure that local testing data is the same
shape as the data in the production MongoDB database, run all MongoDB migration scripts with the following command:

```
yarn migrate-up
```

### 4. View Data in Database (Optional)

Now that the data is living in a local database, you can see it either using the `mongo` command line tool, or through [MongoDB Compass](https://www.mongodb.com/try/download/compass)

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

```
yarn start:database
```

in one terminal, and the following in another:

```
yarn jest
```
