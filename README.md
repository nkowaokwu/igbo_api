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

Inside the project, install the project's dependencies:

```
cd igbo_api/
yarn install
```

To start the dev API server run the following command:

```
yarn dev
```

Navigate to [localhost:8080](http://localhost:8080/) to see the API

## Usage

To search for a term, use the following route structure"

```
/api/v1/search/words?keyword=<keyword>
```

The response will be a plain JSON object

For example:

```
http://localhost:8080/api/v1/search/words?keyword=agụū
```

returns:

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

## Locally Populating Dictionary Data

This project uses [MongoDB](https://docs.mongodb.com/drivers/node/) to store local data.

To populate the database complete the following steps:

### 1. Build a Dictionary

[`dictionary.html`](./dictionaries/html/dictionary.html) is an HTML representation of the Columbia PDF.

The following command parses it and builds a number of JSON dictionaries:

```
yarn build
```

Here's an example JSON dictionary object: [ig-en/ig-en_expanded.json](./dictionaries/ig-en/ig-en_expanded.json)

### 2. Populate the MongoDB Database

Now that we have the data, we need to use that data to populate, or seed, the database:

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

If you see the `✅ Seeding successful.` message in your terminal, then you have successfully populated your database

### 3. See Data in Database (Optional)

Now that the data is living in a local instance of your database, you can see it either using the `mongo` command line tool, or through [MongoDB Compass](https://www.mongodb.com/try/download/compass)

## Testing

This project's test uses locally stored MongoDB data, so to spin up an instance of MongoDB and run the tests run:

```
yarn test
```

If you just want to run the tests with no MongoDB instance, run:

```
yarn mocha
```