const API_ROOT = process.env.NODE_ENV === 'production' ? 'https://igbo-api.herokuapp.com' : 'https://www.igboapi.com';

export default `${API_ROOT}/api/v1/words`;
