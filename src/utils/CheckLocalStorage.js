export default (key, value = 'true') => localStorage.getItem(key) === value;
