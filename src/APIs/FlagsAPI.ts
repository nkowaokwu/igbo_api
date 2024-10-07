import { compact, assign, omit } from 'lodash';
import { OutgoingLegacyWord, OutgoingWord } from '../types/word';
import { SuggestionSourceEnum } from '../shared/constants/SuggestionSourceEnum';

type HandleFlags = {
  data: { words: OutgoingWord[] | OutgoingLegacyWord[], contentLength: number },
  flags: { examples: boolean, dialects: boolean, resolve: boolean },
};

/* FlagsAPI cleans returned MongoDB data to match client-provided flags */
export const handleWordFlags = ({
  data: { words, contentLength },
  flags: { examples, dialects, resolve },
}: HandleFlags) => {
  const updatedWords = compact(
    words.map((word) => {
      let updatedWord: Partial<OutgoingWord | OutgoingLegacyWord> = assign(word);
      if (!examples) {
        // @ts-expect-error version difference
        updatedWord = omit(updatedWord, ['examples']);
      } else if (updatedWord.examples) {
        // Only includes Examples that are created in the Igbo API Editor Platform
        updatedWord.examples = updatedWord.examples.filter(
          (example) => !example.origin || example.origin === SuggestionSourceEnum.INTERNAL,
        );
      }
      if (!dialects) {
        // @ts-expect-error version difference
        updatedWord = omit(updatedWord, ['dialects']);
      }
      if (!resolve) {
        if (updatedWord.stems) {
          updatedWord.stems = updatedWord.stems.map((stem) =>
            (typeof stem === 'string' ? stem : stem?._id || stem.id).toString(),
          );
        }
        if (updatedWord.relatedTerms) {
          updatedWord.relatedTerms = updatedWord.relatedTerms.map((relatedTerm) =>
            (typeof relatedTerm === 'string'
              ? relatedTerm
              : relatedTerm?._id || relatedTerm.id
            ).toString(),
          );
        }
      }
      return updatedWord;
    }),
  );
  return { words: updatedWords, contentLength };
};
