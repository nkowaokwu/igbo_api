/* This file includes the constants necessary to power the API homepage */
export const PORT = 8080;
export const API_FROM_EMAIL = 'kedu@nkowaokwu.com';
export const APP_URL = 'https://igboapi.com';
export const API_ROUTE = APP_URL;
export const DICTIONARY_APP_URL = 'https://nkowaokwu.com';
export const GITHUB_REPO = 'https://github.com/nkowaokwu/igbo_api';
export const GITHUB_CONTRIBUTORS = 'https://api.github.com/repos/nkowaokwu/igbo_api/contributors';
export const GITHUB_STARS = 'https://api.github.com/repos/nkowaokwu/igbo_api';

// Social media
export const TWITTER = 'https://twitter.com/nkowaokwu';
export const INSTAGRAM = 'https://www.instagram.com/nkowaokwu';
export const LINKEDIN = 'https://www.linkedin.com/company/nkowa-okwu';
export const YOUTUBE = 'https://www.youtube.com/c/IjemmaOnwuzulike';

// Projects
export const NKOWAOKWU = 'https://nkowaokwu.com';
export const NKOWAOKWU_CHROME = 'https://nkowaokwu.com/chrome';

// Auth
export const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_EXPIRATION_DAYS = 90; // cookie expiration in days
// Calculate the expiration date based on the current time and the number of days until expiration
const expirationDate = new Date(Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
export const cookieOptions = {
  expires: expirationDate,
  secure: false,
  httpOnly: true,
};
