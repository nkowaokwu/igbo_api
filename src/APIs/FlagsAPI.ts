import compact from 'lodash/compact';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import { LegacyWordDocument, Word, WordDocument } from '../types';

type HandleFlags = {
  data: { words: Word[] | WordDocument[] | LegacyWordDocument[]; contentLength: number };
  flags: { examples: boolean; dialects: boolean; resolve: boolean };
};

/* FlagsAPI cleans returned MongoDB data to match client-provided flags */
export const handleWordFlags = ({
  data: { words, contentLength },
  flags: { examples, dialects, resolve },
}: HandleFlags) => {
  console.time(`Handling word flags - examples: ${examples}, dialects: ${dialects}, resolve: ${resolve}`);
  const updatedWords = compact(
    words.map((word: Word | WordDocument | LegacyWordDocument) => {
      let updatedWord: Partial<Word> | Partial<WordDocument> | Partial<LegacyWordDocument> = assign(word);
      if (!examples) {
        // @ts-expect-error definitions are not compatible
        updatedWord = omit(updatedWord, ['examples']);
      }
      if (!dialects) {
        // @ts-expect-error definitions are not compatible
        updatedWord = omit(updatedWord, ['dialects']);
      }
      if (!resolve) {
        if (updatedWord.stems) {
          updatedWord.stems = updatedWord.stems.map((stem) =>
            (typeof stem === 'string' ? stem : stem?._id || stem.id).toString()
          );
        }
        if (updatedWord.relatedTerms) {
          updatedWord.relatedTerms = updatedWord.relatedTerms.map((relatedTerm) =>
            (typeof relatedTerm === 'string' ? relatedTerm : relatedTerm?._id || relatedTerm.id).toString()
          );
        }
      }
      return updatedWord;
    })
  );
  console.timeEnd(`Handling word flags - examples: ${examples}, dialects: ${dialects}, resolve: ${resolve}`);
  return { words: updatedWords, contentLength };
};
