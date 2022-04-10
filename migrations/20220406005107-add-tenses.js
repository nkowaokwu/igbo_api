/* eslint-disable */
const addTenses = [
  {
    $set: {
      tenses: {
        $function: {
          body: `function(word, wordClass) {
            const vowelHarmonization = {
              a: 'a',
              à: 'a',
              à: 'a',
              á: 'a',
              ā: 'a',
              ị: 'a',
              ị: 'a',
              į: 'a',
              ị̀: 'a',
              ị́: 'a',
              ị̄: 'a',
              e: 'e',
              è: 'e',
              è: 'e',
              é: 'e',
              ē: 'e',
              i: 'i',
              ì: 'i',
              ì: 'i',
              í: 'i',
              ī: 'i',
              o: 'o',
              ó: 'o',
              ò: 'o',
              ò: 'o',
              ō: 'o',
              u: 'o',
              ù: 'o',
              ù: 'o',
              ù: 'o',
              ú: 'o',
              ú: 'o',
              ū: 'o',
              ọ: 'ọ',
              ọ: 'ọ',
              ọ: 'ọ',
              ọ̀: 'ọ',
              ọ́: 'ọ',
              ọ̄: 'ọ',
              ụ: 'ọ',
              ụ: 'ọ',
              ụ̀: 'ọ',
              ụ́: 'ọ',
              ụ̄: 'ọ',
            };
            
            const presentPerfectSuffixes = {
              a: 'ala',
              à: 'ala',
              à: 'ala',
              á: 'ala',
              ā: 'ala',
              ị: 'ala',
              ị: 'ala',
              į: 'ala',
              ị̀: 'ala',
              ị́: 'ala',
              ị̄: 'ala',
              e: 'ela',
              è: 'ela',
              è: 'ela',
              é: 'ela',
              ē: 'ela',
              i: 'ela',
              ì: 'ela',
              ì: 'ela',
              í: 'ela',
              ī: 'ela',
              o: 'ola',
              ó: 'ola',
              ò: 'ola',
              ò: 'ola',
              ō: 'ola',
              u: 'ola',
              ù: 'ola',
              ù: 'ola',
              ù: 'ola',
              ú: 'ola',
              ú: 'ola',
              ū: 'ola',
              ọ: 'ọla',
              ọ: 'ọla',
              ọ: 'ọla',
              ọ̀: 'ọla',
              ọ́: 'ọla',
              ọ̄: 'ọla',
              ụ: 'ọla',
              ụ: 'ọla',
              ụ̀: 'ọla',
              ụ́: 'ọla',
              ụ̄: 'ọla',
            };
            
            // Spell Igbo words with vowels only from the same group
            const lightGroup = ['a', 'à', 'à', 'á', 'ā', 'ị', 'ị', 'į', 'ị̀', 'ị́', 'ị̄', 'ọ', 'ọ', 'ọ̀', 'ọ́', 'ọ̄', 'ụ', 'ụ', 'ụ̀', 'ụ́', 'ụ̄'];
            const heavyGroup = ['e', 'è', 'è', 'é', 'ē', 'i', 'ì', 'ì', 'í', 'ī', 'o', 'ó', 'ò', 'ò', 'ō', 'u', 'ù', 'ù', 'ù', 'ú', 'ú', 'ū'];
            const vowels = [...lightGroup, ...heavyGroup];
            
            const getFirstVowel = (word) => {
              for (let i = 0; i < word.length; i += 1) {
                if (vowels.includes(word.charAt(i))) {
                  return word.charAt(i);
                }
              }
              throw new Error(\`No vowel in word: \${word}\`);
            };
            
            const getLastVowel = (word) => {
              for (let i = word.length - 1; i >= 0; i -= 1) {
                if (vowels.includes(word.charAt(i))) {
                  return word.charAt(i);
                }
              }
              throw new Error(\`No vowel in word: \${word}\`);
            };
            
            const determineInfinitive = (word) => {
              const firstVowel = getFirstVowel(word);
              const affixVowel = lightGroup.includes(firstVowel) ? 'ị' : 'i';
              return \`\${affixVowel}\${word}\`;
            };
            
            const determineActiveImperative = (word) => {
              const lastVowel = getLastVowel(word);
              const harmonizingVowel = vowelHarmonization[lastVowel];
              return \`\${word}\${harmonizingVowel}\`;
            };
            
            const determinePassiveImperative = (word) => {
              const lastVowel = getLastVowel(word);
              return \`\${word}r\${lastVowel}\`;
            };
            
            const determineSimplePast = (word) => {
              const lastVowel = getLastVowel(word);
              return \`\${word}r\${lastVowel}\`;
            };
            
            const determineSimpleActivePresent = (word) => {
              const firstVowel = getFirstVowel(word);
              const harmonizingVowel = heavyGroup.includes(firstVowel) ? 'e' : 'a';
              return \`na-\${harmonizingVowel}\${word}\`;
            };
            
            const determineSimplePassivePresent = (word) => word;
            
            const determineActivePresentContinuous = (word) => {
              const firstVowel = getFirstVowel(word);
              const harmonizingVowel = heavyGroup.includes(firstVowel) ? 'e' : 'a';
              return \`na-\${harmonizingVowel}\${word}\`;
            };
            
            const determinePassivePresentContinuous = (word) => word;
            
            const determineMedialPresentContinuous = (word) => {
              const lastVowel = getLastVowel(word);
              return \`\${word}r\${lastVowel}\`;
            };
            
            const determineSimplePresentNegative = (word) => {
              const firstVowel = getFirstVowel(word);
              const harmonizingVowel = heavyGroup.includes(firstVowel) ? 'e' : 'a';
              return \`naghi \${harmonizingVowel}\${word}\`;
            };
            
            const determinePresentContinuousNegative = (word) => {
              const firstVowel = getFirstVowel(word);
              const harmonizingVowel = heavyGroup.includes(firstVowel) ? 'e' : 'a';
              return \`naghị \${harmonizingVowel}\${word}\`;
            };
            
            const determineFuture = (word) => {
              const firstVowel = getFirstVowel(word);
              const harmonizingVowel = heavyGroup.includes(firstVowel) ? 'e' : 'a';
              return \`ga-\${harmonizingVowel}\${word}\`;
            };
            
            const isActiveVerb = (wordClass) => wordClass === 'AV';
            const isMedialVerb = (wordClass) => wordClass === 'MV';
            const isPassiveVerb = (wordClass) => wordClass === 'PV';

            const isVerb = (wordClas) => isActiveVerb(wordClass) || isMedialVerb(wordClass) || isPassiveVerb(wordClass);
            
            const verbStem = word.split(' ')[0];
            const verbSegments = word.split(' ').slice(1);

            if (verbStem && isVerb(wordClass)) {
              try {
                return Object.entries({
                  infinitive: determineInfinitive(verbStem),
                  imperative: isActiveVerb(wordClass) || isMedialVerb(wordClass)
                    ? determineActiveImperative(verbStem)
                    : determinePassiveImperative(verbStem),
                  simplePast: determineSimplePast(verbStem),
                  simplePresent: isActiveVerb(wordClass)
                    ? determineSimpleActivePresent(verbStem)
                    : determineSimplePassivePresent(verbStem),
                  presentContinuous: isActiveVerb(wordClass)
                    ? determineActivePresentContinuous(verbStem)
                    : isPassiveVerb(wordClass)
                      ? determinePassivePresentContinuous(verbStem)
                      : determineMedialPresentContinuous(verbStem),
                  future: determineFuture(verbStem),
                }).reduce((finalObject, [key, value]) => {
                  return {
                    ...finalObject,
                    [key]: \`\${value} \${verbSegments.join(' ')}\`,
                  }
                }, {});
              } catch (err) {
                return {};
              }
            }
            return {};
          };`,
          args: [
            '$word',
            '$wordClass',
          ],
          lang: 'js',
        },
      },
    },
  },
];

const tensesnRevert = [
  {
    $unset: 'tenses',
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions', 'genericwords'];
    await Promise.all(
      collections.map(async (collection) => {
        const docs = await (await db.collection(collection).aggregate(addTenses)).toArray();
        await Promise.all(docs.map((doc) => (
          db.collection(collection).updateOne(
            // eslint-disable-next-line
            { _id: doc._id },
            {
              $set: { tenses: doc.tenses },
            },
          )
        )));
      }));
  },

  async down(db) {
    const collections = ['words', 'examples', 'wordsuggestions', 'examplesuggestions', 'genericwords'];
    await Promise.all(
      collections.map(async (collection) => {
        const docs = await (await db.collection(collection).aggregate(tensesnRevert)).toArray();
        await Promise.all(docs.map((doc) => (
          db.collection(collection).updateOne(
            // eslint-disable-next-line
            { _id: doc._id },
            {
              $unset: { tenses: null },
            },
          )
        )));
      }));
  },
};
