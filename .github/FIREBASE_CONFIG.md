# Firebase Configuration Guide

This project relies on Firebase Cloud Functions to execute the Igbo API business logic.

Individual contributors need to integrate their own Firebase project config to be able to run the project locally and merge forked changes.

## Step 1: Create a Firebase Project

Please follow this [Firebase Getting Started Guide](https://firebase.google.com/docs/web/setup) to create your own Firebase project.

## Step 2: Replace the `default` Firebase Project Name

Within [.firebaserc](https://github.com/nkowaokwu/igbo_api/blob/master/.firebaserc), replace the project name `igbo-api-bb22d` with your new Firebase project name

## Step 3: Replace the Firebase Config file

Within [firebase.js](https://github.com/nkowaokwu/igbo_api/blob/master/src/services/firebase.js#L5-L13), replace the `FIREBASE_CONFIG` object with your firebase project config object

## Step 4: Merging forked changes into main repo

Congrats 🎉 You're ready to start making your first changes to your repo. Please refer to our [Contributing Guide](https://github.com/nkowaokwu/igbo_api/blob/master/.github/CONTRIBUTING.md) to learn how to contribute to the project.
