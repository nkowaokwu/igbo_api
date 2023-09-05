import { assign, omit, pick } from 'lodash';
import Version from '../../shared/constants/Version';

const minimizeWords = (words, version) => {
  console.time('Minimize words');
  const minimizedWords = words.map((word) => {
    let minimizedWord = assign(word);
    minimizedWord = omit(minimizedWord, ['hypernyms', 'hyponyms', 'updatedAt', 'createdAt']);
    minimizedWord.definitions =
      version === Version.VERSION_2
        ? (minimizedWord.definitions || []).map((definition) => {
            let minimizedDefinition = assign(definition);
            minimizedDefinition = omit(minimizedDefinition, ['label', 'igboDefinitions', '_id', 'id']);
            if (!minimizedDefinition.nsibidi) {
              minimizedDefinition = omit(minimizedDefinition, ['nsibidi']);
            }
            return minimizedDefinition;
          })
        : minimizedWord.definitions;
    if (!minimizedWord.variations?.length) {
      minimizedWord = omit(minimizedWord, ['variations']);
    }
    if (minimizedWord.examples?.length) {
      minimizedWord.examples = minimizedWord.examples?.map((example) => {
        let minimizedExample = assign(example);
        minimizedExample = omit(example, [
          'associatedWords',
          'pronunciation',
          'updatedAt',
          'createdAt',
          'meaning',
          'style',
          'associatedDefinitionsSchemas',
          'archived',
          'id',
        ]);
        if (!minimizedExample.nsibidi) {
          minimizedExample = omit(minimizedExample, ['nsibidi']);
        }
        return minimizedExample;
      });
    } else {
      minimizedWord = omit(minimizedWord, ['example']);
    }

    const tensesValues = Object.values(minimizedWord.tenses || {});
    if (!tensesValues.length || tensesValues.every((tense) => tense === '')) {
      minimizedWord = omit(minimizedWord, ['tenses']);
    }

    if (version === Version.VERSION_2 && minimizedWord.dialects?.length) {
      minimizedWord.dialects = minimizedWord.dialects?.map((dialect) => {
        let minimizedDialect = omit(dialect, ['variations', 'id', '_id']);
        if (!minimizedDialect.pronunciation) {
          minimizedDialect = omit(minimizedDialect, ['pronunciation']);
        }
        return minimizedDialect;
      });
    } else if (version === Version.VERSION_2 && !minimizedWord.dialects?.length) {
      minimizedWord = omit(minimizedWord, ['dialects']);
    }

    if (minimizedWord.relatedTerms?.length) {
      minimizedWord.relatedTerms = minimizedWord.relatedTerms?.map((relatedTerm) => {
        if (typeof relatedTerm === 'string' || !relatedTerm) {
          return relatedTerm;
        }
        return pick(relatedTerm, ['word', 'id', '_id']);
      });
    } else {
      minimizedWord = omit(minimizedWord, ['relatedTerms']);
    }

    if (minimizedWord.stems?.length) {
      minimizedWord.stems = minimizedWord.stems?.map((stem) => {
        if (typeof stem === 'string' || !stem) {
          return stem;
        }
        return pick(stem, ['word', 'id', '_id']);
      });
    } else {
      minimizedWord = omit(minimizedWord, ['stems']);
    }
    return minimizedWord;
  });
  console.timeEnd('Minimize words');
  return minimizedWords;
};

export default minimizeWords;
