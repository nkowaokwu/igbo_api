# Igbo Dictionary API
[Contributing](./.github/CONTRIBUTING.md) | [Code of Conduct](./.github/CODE_OF_CONDUCT.md) | [Slack Channel](https://igboapi.slack.com)

> Igbo is the principal native language of the Igbo people, an ethnic group of southeastern Nigeria, and is spoken by approx 45 million people in at least 20 different dialects.

This repo parses the words, word classes, definitions, and more from the Columbia University paper [*Dictionary of Ònìchà Igbo*](http://www.columbia.edu/itc/mealac/pritchett/00fwp/igbo/IGBO%20Dictionary.pdf).

## Getting Started

This API is not publicly available. To run the API, you must run it locally on your machine.

Clone the project:

```
git clone https://github.com/ijemmao/igbo_api.git
```

This project uses [Yarn](https://classic.yarnpkg.com/lang/en/) to manage local dependencies, if you don't have installed you can get it [here](https://classic.yarnpkg.com/en/docs/install).

Move in the project directory and install it's dependencies:

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

### MongoDB Data

The database will initially be empty, meaning that no words will be returned from the API. To populate your local MongoDB database, read through [Locally Populating Dictionary Data](#populating-data)

Once you've populated your data, use the follow route structure to get word information:

```
/api/v1/search/words?keyword=<keyword>
```

For example:

```
http://localhost:8080/api/v1/search/words?keyword=agụū
```

You can also search with English terms with the same route:

```
/api/v1/search/words?keyword=hunger
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

This project requires the use of [MongoDB](http://docs.mongodb.com/) to locally store data. If you don't have MongoDB installed you can ge it [here](https://docs.mongodb.com/manual/administration/install-community/).

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

Tests use both locally stored MongoDB and JSON data, so to spin up an instance of MongoDB and start the tests at the same text, run:

```
yarn test
```

If you just want to run the tests with no MongoDB instance, run:

```
yarn mocha
```
