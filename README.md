# Igbo Dictionary API
![integration](https://github.com/ijemmao/igbo_api/workflows/integration/badge.svg)

[Contributing](./.github/CONTRIBUTING.md) | [Code of Conduct](./.github/CODE_OF_CONDUCT.md) | [Slack Channel](https://igboapi.slack.com)

> Igbo is the principal native language of the Igbo people, an ethnic group of southeastern Nigeria, and is spoken by approx 45 million people in at least 20 different dialects.

This repo parses the words, word classes, definitions, and more from the Columbia University paper [*Dictionary of Ònìchà Igbo*](http://www.columbia.edu/itc/mealac/pritchett/00fwp/igbo/IGBO%20Dictionary.pdf).

## Try it Out
For a demo, check out this link [http://igboapi.com/api/v1/search/words](http://www.igboapi.com/api/v1/search/words)

## Getting Started

These instructions will get a copy of the project up and running on your machine for development and testing purposes.

### Prerequisites

To run this project locally, the follow tools need to be installed:

* [Node.js](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)
* [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)

### Installation

Clone the project:

```
git clone https://github.com/ijemmao/igbo_api.git
```

Move into the project directory and install it's dependencies:

```
cd igbo_api/
yarn install
```

If you are running the API on Windows operating system, run the module to install it globally:

```
cd igbo_api/                   
yarn add --optional win-node-env
```

To start the dev API server run the following command:

```
yarn dev
```

Navigate to [localhost:8080](http://localhost:8080/) to see the API

## Usage

### Documentation

#### Development
After starting the API server with this `yarn dev`, visit `http://localhost:8080/docs`.

#### Production
You can also view the productions docs by visiting `http://igboapi.com/docs`.

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

```
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

[`dictionary.html`](./src/dictionaries/html/dictionary.html) is an HTML representation of the Columbia PDF that contains all the words and their information.

The following command parses the `html` file and builds a number JSON files:

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

After about 20 seconds, if you see the `✅ Seeding successful.` message in your terminal, then you have successfully populated your database!

### 3. See Data in Database (Optional)

Now that the data is living in a local database, you can see it either using the `mongo` command line tool, or through [MongoDB Compass](https://www.mongodb.com/try/download/compass)

## Testing

Tests use both locally stored MongoDB and JSON data, so to spin up an instance of MongoDB and start the tests at the same time, run:

```
yarn test
```

If you want to run your MongoDB instance and tests in separate terminals, you can run:

```
yarn start:database
```

in one terminal, and the following in another:

```
yarn mocha
```
