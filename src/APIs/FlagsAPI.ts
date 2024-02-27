import compact from 'lodash/compact';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import { LegacyWordDocument, Word, WordDocument } from '../types';
import { WordType, PartialWordType } from '../types/word';

type HandleFlags = {
  data: { words: WordType[], contentLength: number },
  flags: { examples: boolean, dialects: boolean, resolve: boolean },
};

/* FlagsAPI cleans returned MongoDB data to match client-provided flags */
export const handleWordFlags = ({
  data: { words, contentLength },
  flags: { examples, dialects, resolve },
}: HandleFlags) => {
  const updatedWords = compact(
    words.map((word: Word | WordDocument | LegacyWordDocument) => {
      let updatedWord: PartialWordType = assign(word);
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
            (typeof relatedTerm === 'string'
              ? relatedTerm
              : relatedTerm?._id || relatedTerm.id
            ).toString()
          );
        }
      }
      return updatedWord;
    })
  );
  return { words: updatedWords, contentLength };
};
