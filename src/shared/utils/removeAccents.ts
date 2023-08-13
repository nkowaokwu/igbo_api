const accents = {
  // Remove all diacritic marks including underdots
  remove: (string = '') => string.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  // Remove all diacritic marks excluding underdots
  removeExcluding: (string = '') => string.normalize('NFD').replace(/(?!\u0323)[\u0300-\u036f]/g, ''),
};

export default accents;
