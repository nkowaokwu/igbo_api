# Igbo Dictionary
*Igbo is the principal native language of the Igbo people, an ethnic group of southeastern Nigeria, and is spoken by approx 45 million people in at least 20 different dialects.*

This repo parses the words, word classes, definitions, and more from the Columbia University paper [*Dictionary of Ònìchà Igbo*](http://www.columbia.edu/itc/mealac/pritchett/00fwp/igbo/IGBO%20Dictionary.pdf).

## Start the API

To start the dev API server run the following command:

```
yarn dev
```

Navigate to [localhost:8080](http://localhost:8080/) to see the API

### Usage

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
{
    "wordClass": "n.",
    "definition": "hunger; desire; eagerness",
    "examples": [],
    "phrases": {
        "(agụū) -gụ": {
            "definition": "be hungry",
            "examples": []
        },
        "agụū mmīli": {
            "definition": "thirst",
            "examples": []
        },
        "-gụ agụū": {
            "definition": "hunger; desire; long for ( -gụ 2. desire)",
            "examples": []
        }
    }
}
```

## Build a Dictionary

Even though the Igbo dictionary files are already available in this repo, you can still run the script that's responsible for parsing the Columbia paper and creating the `.json` and `.txt` files.

`dictionary.html` is an HTML representation of the Columbia PDF.

To parse `dictionary.html` and build a dictionary, run the following command:

```
yarn build
```

This will produce three different files in the `ig` directory:

[dictionaries/ig-en.txt](./ig/dictionaries/ig-en.txt)

[dictionaries/ig-en.json](./ig/dictionaries/ig-en.json)

[dictionaries/ig-en_expanded.json](./ig/dictionaries/ig-en_expanded.json)

[dictionaries/ig-en_normalized.json](./ig/dictionaries/ig-en_normalized.json)

[dictionaries/ig-en_normalized_expanded.json](./ig/dictionaries/ig-en_normalized_expanded.json)
