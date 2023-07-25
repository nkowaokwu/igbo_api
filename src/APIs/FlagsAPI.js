import compact from 'lodash/compact';
import assign from 'lodash/assign';
import omit from 'lodash/omit';

/* FlagsAPI cleans returned MongoDB data to match client-provided flags */
export const handleWordFlags = ({ data: { words, contentLength }, flags: { examples, dialects, resolve } }) => {
  console.time(`Handling word flags - examples: ${examples}, dialects: ${dialects}, resolve: ${resolve}`);
  const updatedWords = compact(
    words.map((word) => {
      let updatedWord = assign(word);
      if (!examples) {
        updatedWord = omit(updatedWord, ['examples']);
      }
      if (!dialects) {
        updatedWord = omit(updatedWord, ['dialects']);
      }
      if (!resolve) {
        if (updatedWord.stems) {
          updatedWord.stems = updatedWord.stems.map((stem) => stem._id || stem.id);
        }
        if (updatedWord.relatedTerms) {
          updatedWord.relatedTerms = updatedWord.relatedTerms.map((relatedTerm) => relatedTerm._id || relatedTerm.id);
        }
      }
      return updatedWord;
    })
  );
  console.timeEnd(`Handling word flags - examples: ${examples}, dialects: ${dialects}, resolve: ${resolve}`);
  return { words: updatedWords, contentLength };
};
