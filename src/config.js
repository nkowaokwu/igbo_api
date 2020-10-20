const API_ROOT = process.env.NODE_ENV === 'production' ? 'http://igboapi.com' : 'https://cors-anywhere.herokuapp.com/http://www.igboapi.com';

export default `${API_ROOT}/api/v1/words`;
