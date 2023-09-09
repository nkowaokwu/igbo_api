import { assign, omit, pick } from 'lodash';
import { Types } from 'mongoose';
import Version from '../../shared/constants/Version';
import { Definition, LegacyWordDialect, PartialWordType, WordDialect } from '../../types/word';
import { Example } from '../../types';

type MinimizedWord = Omit<PartialWordType, 'definitions' | 'examples' | 'dialects' | 'relatedTerms' | 'stems'> & {
  definitions: Partial<Definition>[] | string[] | undefined;
  examples: Partial<Example>[];
  tenses: string[] | undefined;
  dialects?: Partial<WordDialect>[] | LegacyWordDialect | undefined;
  relatedTerms?: (string | Partial<{ id: string; _id?: Types.ObjectId }>)[];
  stems?: (string | Partial<{ id: string; _id?: Types.ObjectId }>)[];
};
const minimizeWords = (words: PartialWordType[], version: Version) => {
  console.time('Minimize words');
  const minimizedWords = words.map((word) => {
    let minimizedWord: Partial<MinimizedWord> = assign(word);
    minimizedWord = omit(minimizedWord, ['hypernyms', 'hyponyms', 'updatedAt', 'createdAt']);
    minimizedWord.definitions =
      version === Version.VERSION_2
        ? ((minimizedWord.definitions || []).map((definition) => {
            let minimizedDefinition: Partial<Definition> | string = assign(definition);
            if (typeof definition === 'object') {
              minimizedDefinition = omit(minimizedDefinition as Partial<Definition>, [
                'label',
                'igboDefinitions',
                '_id',
                'id',
              ]);
              if (!minimizedDefinition.nsibidi) {
                minimizedDefinition = omit(minimizedDefinition, ['nsibidi']);
              }
            }
            return minimizedDefinition;
          }) as Partial<Definition>[] | string[])
        : (minimizedWord.definitions as undefined);
    if (!minimizedWord.variations?.length) {
      minimizedWord = omit(minimizedWord, ['variations']);
    }
    if (minimizedWord.examples?.length) {
      minimizedWord.examples = minimizedWord.examples?.map((example) => {
        let minimizedExample = assign(example);
        minimizedExample = omit(minimizedExample, [
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
      if (Array.isArray(minimizedWord.dialects))
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
