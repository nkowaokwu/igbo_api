# Igbo Dictionary Frontend

This is the source code that's responsible for the Igbo Dictionary front-site.

## Getting Started

These instructions will get a copy of the project up and running on your machine for development and testing purposes.

### Prerequisites

To run this project locally, the follow tools need to be installed:

* [Node.js](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Installation

Clone the project:

```
git clone https://github.com/ijemmao/igbo_api.git
```

Move into the project directory, switch to the `gatsby-dev` branch, and install it's dependencies:

```
cd igbo_api/
git checkout gatsby-dev && yarn install
```

If you are running the API on Windows operating system, run the module to install it globally:

```
cd igbo_api/                   
git checkout gatsby-dev && yarn add --optional win-node-env
```

To start the dev API server run the following command:

```
yarn develop
```

Navigate to [localhost:8000](http://localhost:8000/) to see the front-site

## Testing

The project uses [Cypress](https://cypress.io) for unit tests. To execute all the tests, run:

```
yarn test
```

If you want to run the tests headless, run :

```
yarn test:run
```