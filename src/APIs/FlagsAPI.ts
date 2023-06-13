import { compact, assign, omit } from 'lodash';
import Word from '../models/interfaces/Word';

/* FlagsAPI cleans returned MongoDB data to match client-provided flags */
export const handleWordFlags = ({
  data: { words, contentLength },
  flags: { examples, dialects, resolve },
}: {
  data: { words: Word[]; contentLength: number };
  flags: { examples: boolean; dialects: boolean; resolve: boolean };
}) => {
  const updatedWords = compact(
    words.map((word) => {
      let updatedWord: Partial<Word> = assign(word);
      if (!examples) {
        updatedWord = omit(updatedWord, ['examples']);
      }
      if (!dialects) {
        updatedWord = omit(updatedWord, ['dialects']);
      }
      if (!resolve) {
        if (updatedWord.stems) {
          updatedWord.stems = updatedWord.stems.map((stem) =>
            typeof stem === 'string' ? stem : stem._id?.toString() || stem.id,
          );
        }
        if (updatedWord.relatedTerms) {
          updatedWord.relatedTerms = updatedWord.relatedTerms.map((relatedTerm) => {
            if (typeof relatedTerm === 'string') {
              return relatedTerm;
            }
            return relatedTerm._id?.toString() || relatedTerm.id;
          });
        }
      }
      return updatedWord;
    }),
  );
  return { words: updatedWords, contentLength };
};
