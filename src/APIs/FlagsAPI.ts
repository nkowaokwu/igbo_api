import compact from 'lodash/compact';
import assign from 'lodash/assign';
import omit from 'lodash/omit';

interface Word {
  id?: string;
  stems?: Array<string | { id?: string }>;
  relatedTerms?: Array<string | { id?: string }>;
  examples?: any; // Update the type of `examples` accordingly
  dialects?: any; // Update the type of `dialects` accordingly
}

interface Data {
  words: Word[];
  contentLength: number;
}

interface Flags {
  examples?: boolean;
  dialects?: boolean;
  resolve?: boolean;
}

interface HandleWordFlagsParams {
  data: Data;
  flags: Flags;
}

export const handleWordFlags = ({
  data: { words, contentLength },
  flags: { examples, dialects, resolve },
}: HandleWordFlagsParams) => {
  const updatedWords = compact(
    words.map((word) => {
      let updatedWord = assign({}, word);
      if (!examples) {
        updatedWord = omit(updatedWord, ['examples']);
      }
      if (!dialects) {
        updatedWord = omit(updatedWord, ['dialects']);
      }
      if (!resolve) {
        if (updatedWord.stems) {
          updatedWord.stems = updatedWord.stems.map((stem) => (typeof stem === 'string' ? stem : stem.id));
        }
        if (updatedWord.relatedTerms) {
          updatedWord.relatedTerms = updatedWord.relatedTerms.map((relatedTerm) =>
            typeof relatedTerm === 'string' ? relatedTerm : relatedTerm.id
          );
        }
      }
      return updatedWord;
    })
  );
  return { words: updatedWords, contentLength };
};
