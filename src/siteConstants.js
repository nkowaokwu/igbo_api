/* This file includes the constants necessary to power the API homepage */
export const PORT = process.env.PORT || 8080;
export const API_ROUTE = process.env.DOMAIN_NAME
  ? `https://${process.env.DOMAIN_NAME}`
  : `http://localhost:${PORT}`;
export const API_FROM_EMAIL = process.env.API_FROM_EMAIL || 'kedu@nkowaokwu.com';
export const DICTIONARY_APP_URL = 'https://nkowaokwu.com/home';
export const GITHUB_REPO = 'https://github.com/nkowaokwu/igbo_api';
export const GITHUB_CONTRIBUTORS = 'https://api.github.com/repos/nkowaokwu/igbo_api/contributors';
export const GITHUB_STARS = 'https://api.github.com/repos/nkowaokwu/igbo_api';
