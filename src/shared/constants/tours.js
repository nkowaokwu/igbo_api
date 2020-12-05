import { map } from 'lodash';

const PRIMARY_BUTTON_CLASS = 'shepherd-button-primary';
const SECONDARY_BUTTON_CLASS = 'shepherd-button-secondary';
const BUTTON_OPTIONS = [
  {
    classes: SECONDARY_BUTTON_CLASS,
    text: 'Exit',
    action() {
      this.cancel();
    },
  },
  {
    classes: PRIMARY_BUTTON_CLASS,
    text: 'Next',
    action() {
      this.next();
    },
  },
];
const BEFORE_SHOW_PROMISE = () => (
  new Promise((resolve) => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      resolve();
    }, 100);
  })
);

const constructSteps = (stepsAttributes) => (
  map(stepsAttributes, (stepAttributes) => ({
    beforeShowPromise: BEFORE_SHOW_PROMISE,
    buttons: BUTTON_OPTIONS,
    highlightClass: 'highlight',
    ...stepAttributes,
  }))
);

export const homeTourSteps = constructSteps([
  {
    attachTo: { element: '.search-bar', on: 'bottom' },
    title: 'Start Searching Words',
    text: ['Nkowaokwu search handles both English and Igbo search, no need to specific which language you\'re using'],
    beforeShowPromise: () => (
      new Promise((resolve) => {
        setTimeout(() => {
          window.scrollTo(0, 0);
          resolve();
        }, 300);
      })
    ),
    buttons: [
      {
        classes: PRIMARY_BUTTON_CLASS,
        text: 'Got it',
        action() {
          this.next();
        },
      },
    ],
  },
]);

export const searchTourSteps = constructSteps([
  {
    attachTo: { element: '.word', on: 'bottom' },
    title: 'Word Results',
    text: ['Each result comes with word variations, definitions, and examples.'],
  },
  {
    attachTo: { element: '.word-select-options', on: 'bottom' },
    title: 'You can contribute',
    text: ['See a typo or want to add an example, you can do so here.'],
  },
  {
    attachTo: { element: '.word-details', on: 'bottom' },
    title: 'See More Information',
    text: ['To see more information related to the word, you can go to the Details page.'],
  },
  {
    attachTo: { element: '.add-button', on: 'bottom' },
    title: 'Adding Words',
    text: ['If you don\'t see a word in the search results, you can submit a new word to be reviewed by our editors.'],
    buttons: [
      {
        classes: SECONDARY_BUTTON_CLASS,
        text: 'Exit',
        action() {
          this.cancel();
        },
      },
      {
        classes: PRIMARY_BUTTON_CLASS,
        text: 'Got it',
        action() {
          this.next();
        },
      },
    ],
  },
]);
