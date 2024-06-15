export default () =>
  typeof window !== 'undefined' ? window?.location?.host === 'igboapi.com' : false;
