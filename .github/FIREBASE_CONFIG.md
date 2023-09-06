# Firebase Configuration Guide

This project relies on Firebase Cloud Functions to execute the Igbo API business logic.

Individual contributors need to integrate their own Firebase project config to be able to run the project locally and merge forked changes.

## Step 1: Create a Firebase Project

Please follow this [Firebase Getting Started Guide](https://firebase.google.com/docs/web/setup) to create your own Firebase project.

## Step 1a: Log into Firebase via Terminal (CLI)

In your terminal, log into your Firebase account by running the command and following the prompts:

```bash
npx firebase login
```

## Step 1b: Select the Blaze, pay as you go Firebase plan

Make sure to update your Billing options for your Firebase project. This will allow your project to use emulators. Don't worry, it's free 😉

## Step 2: Replace the `default` Firebase Project ID

Within [.firebaserc](https://github.com/nkowaokwu/igbo_api/blob/master/.firebaserc), replace the project ID `igbo-api-bb22d` with your new Firebase project ID

## Step 3: Replace the Firebase Config file

Within [firebase.ts](https://github.com/nkowaokwu/igbo_api/blob/master/src/services/firebase.ts#L5-L13), replace the `FIREBASE_CONFIG` object with your firebase project config object

## Step 4: Select your default project

Run the following command to select your default Firebase project:

```bash
npx firebase use default
```

Selecting a Firebase project is important for Firebase to know which project configure it should use when starting your dev environment.

## Step 5: Merging forked changes into main repo

Congrats 🎉 You're ready to start making your first changes to your repo. Please refer to our [Contributing Guide](https://github.com/nkowaokwu/igbo_api/blob/master/.github/CONTRIBUTING.md) to learn how to contribute to the project.
