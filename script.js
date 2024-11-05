const fs = require('fs');
const dataset = require('./igbo-api-dataset.json');

const dialects = dataset.flatMap((word) => {
  if (word.variations) {
    console.log(word.variations);
  }
  return { dialects: word.dialects, variations: word.variations || [] };
});

fs.writeFileSync('igbo-api-dialects.json', JSON.stringify(dialects, null, 2));
