import fs from 'fs';

const res = JSON.parse(fs.readFileSync('./igbo_api_words.json', { encoding: 'utf8', flag: 'r' }));
const addressedKeys = ['ji', 'okpokoro', 'm', 'gha', 'kà', 'ebe', 'àbà', 'fè', 'ahụhụ', 'òjem̀bà',  'dìigị̀ịzị̀', 'dakwàsà', 'mma', 'bedewe',  'bụgbàdò', 'ntụ̀ziakā', 'enyì',    'bi',       'm̀kpà',       'o',       'ọnya',
'sè okwu', 'jụ',       'kè',         'ghe',     'gba',
'wèrè',    'kò',       'isi',        'mà',      'kpa',
're',      'kwe',      'mbà',        'gụ',      'sụ̀',
'ka',      'ta',       'ntà',        'be',      'nkwà',
'nà',      'kwà',      'àzị̀',        'lò',      'gụ',
'òsè',     'sà',       'ọzọ̄',        'ùju',     'ozi',
'zọ̀',      'zi',       'tọ',         'zọ',      'ùbe', 'me àkàjà', 'nwaatụrụ̄', 'to uto', 'gahiè ụzọ̀', 'eluēlu', 'àhàjiọkụ̄', 'ahịa orirē', 'ndịozī', 'sụpụ̀', 'hịọ', 'ọ̀kpụīsi-eringo', 'àbụmọnụ', 'kpọm'];

// 'èzùmike'
// kpọm
const wordsMap = {};
res.forEach((word) => {
  if (!wordsMap[word.word]) {
    wordsMap[word.word] = 0;
  }
  wordsMap[word.word] += 1;
});
const duplicatedWords = Object.entries(wordsMap).reduce((finalList, [key, value]) => {
  if (value > 1 && !addressedKeys.includes(key)) {
    finalList.push(key);
  }
  return finalList;
}, []);
console.log(duplicatedWords);