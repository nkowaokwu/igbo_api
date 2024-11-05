/* This file includes the constants necessary to power the API homepage */
export const PORT = 8080;
export const API_FROM_EMAIL = 'kedu@nkowaokwu.com';
export const APP_URL = 'https://igboapi.com';
export const API_ROUTE = APP_URL;
export const DICTIONARY_APP_URL = 'https://nkowaokwu.com';
export const SPEECH_TO_TEXT_APP_URL = 'https://speech.igboapi.com';
export const GITHUB_REPO = 'https://github.com/nkowaokwu/igbo_api';
export const GITHUB_CONTRIBUTORS = 'https://api.github.com/repos/nkowaokwu/igbo_api/contributors';
export const GITHUB_STARS = 'https://api.github.com/repos/nkowaokwu/igbo_api';
export const SERVER_DOMAIN =
  typeof window !== 'undefined' && window.location.host.includes('igboapi')
    ? 'https://igboapi.com'
    : 'http://localhost:8080';

// Social media
export const TWITTER = 'https://twitter.com/nkowaokwu';
export const INSTAGRAM = 'https://www.instagram.com/nkowaokwu';
export const LINKEDIN = 'https://www.linkedin.com/company/nkowa-okwu';
export const YOUTUBE = 'https://www.youtube.com/c/IjemmaOnwuzulike';

// Projects
export const NKOWAOKWU = 'https://nkowaokwu.com';
export const NKOWAOKWU_CHROME = 'https://nkowaokwu.com/chrome';
export const SABBI_DASHBOARD = 'https://dashboard.sabbidata.com';

// Resources
export const HUGGING_FACE = 'https://huggingface.co/nkowaokwu';
export const KAGGLE = 'https://www.kaggle.com/organizations/nkowaokwu';

// Donate
export const DONATE_URL = 'https://donate.stripe.com/dR62aP6UlcmE3kIfYY';
