import { assign, omit } from 'lodash';
import { Types } from 'mongoose';
import Version from '../../shared/constants/Version';
import {
  Definition,
  LegacyWordDialect,
  OutgoingLegacyWord,
  OutgoingWord,
  WordDialect,
} from '../../types/word';
import { OutgoingExample } from '../../types';

type MinimizedWord = Omit<
  Partial<OutgoingWord> | Partial<OutgoingLegacyWord>,
  // @ts-expect-error trailing comma
  'definitions' | 'examples' | 'dialects' | 'relatedTerms' | 'stems',
> & {
  definitions: Partial<Definition>[] | string[] | undefined,
  examples: Partial<OutgoingExample>[],
  tenses: string[] | undefined,
  dialects?: Partial<WordDialect>[] | LegacyWordDialect | undefined,
  relatedTerms?: (string | Partial<{ word: string, _id: Types.ObjectId }>)[],
  stems?: (string | Partial<{ word: string, _id: Types.ObjectId }>)[],
};
const minimizeWords = (
  words: Partial<OutgoingWord>[] | Partial<OutgoingLegacyWord>[],
  version: Version
) => {
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
        : minimizedWord.definitions;
    if (!minimizedWord.variations?.length) {
      minimizedWord = omit(minimizedWord, ['variations']);
    }
    if (minimizedWord.examples?.length) {
      minimizedWord.examples = minimizedWord.examples?.map((example) => {
        const originalExample = assign(example);
        const minimizedExample = omit(originalExample, [
          'associatedWords',
          'updatedAt',
          'createdAt',
          'meaning',
          'style',
          'associatedDefinitionsSchemas',
          'archived',
          'id',
        ]);
        return minimizedExample;
      });
    }

    const tensesValues = Object.values(minimizedWord.tenses || {});
    if (!tensesValues.length || tensesValues.every((tense) => tense === '')) {
      minimizedWord = omit(minimizedWord, ['tenses']);
    }

    if (version === Version.VERSION_2 && minimizedWord.dialects?.length) {
      if (Array.isArray(minimizedWord.dialects))
        minimizedWord.dialects = minimizedWord.dialects.map((dialect) => {
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
      minimizedWord.relatedTerms = (minimizedWord.relatedTerms || [])
        .map((relatedTerm): string | { word: string, id: string } => {
          if (typeof relatedTerm === 'string' || !relatedTerm) {
            return relatedTerm;
          }
          return {
            word: relatedTerm.word || '',
            id: (relatedTerm._id || '').toString(),
          };
        })
        .filter((relatedTerm) => Boolean(relatedTerm))
        .filter((relatedTerm) => {
          if (typeof relatedTerm === 'string') {
            return relatedTerm;
          }
          return relatedTerm.word && relatedTerm.id;
        });
    } else {
      minimizedWord = omit(minimizedWord, ['relatedTerms']);
    }

    if (minimizedWord.stems?.length) {
      minimizedWord.stems = minimizedWord.stems
        ?.map((stem): { word: string, id: string } | string => {
          if (typeof stem === 'string' || !stem) {
            return stem;
          }

          return {
            word: stem.word || '',
            id: (stem._id || '').toString(),
          };
        })
        .filter((stem) => stem)
        .filter((relatedTerm) => {
          if (typeof relatedTerm === 'string') {
            return relatedTerm;
          }
          return relatedTerm.word && relatedTerm.id;
        });
    } else {
      minimizedWord = omit(minimizedWord, ['stems']);
    }
    return minimizedWord;
  });
  return minimizedWords;
};

export default minimizeWords;
