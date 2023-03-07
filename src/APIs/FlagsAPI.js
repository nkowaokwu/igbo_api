import compact from 'lodash/compact';
import assign from 'lodash/assign';
import omit from 'lodash/omit';

/* FlagsAPI cleans returned MongoDB data to match client-provided flags */
export const handleWordFlags = ({
  data: { words, contentLength },
  flags: { examples, dialects, resolve },
}) => {
  const updatedWords = compact(words.map((word) => {
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
  }));
  return { words: updatedWords, contentLength };
};

export const handleTagsFlag = ({
  data: { words },
  flags: { tags },
}) => {
  const updatedWords = compact(words.map((word) => {
    const updatedWord = assign(word);
    if (tags.length && Array.isArray(word.tags)) {
      const hasTags = word.tags.some((tag) => tags.includes(tag));
      if (!hasTags) {
        return null;
      }
    }
    if (wordClasses.length) {
      const hasWordClass = word.definitions.some(({ wordClass }) => wordClasses.includes(wordClass));
      if (!hasWordClass) {
        return null;
      }
    }
    return updatedWord;
  }));
  return { words: updatedWords, contentLength: updatedWords.length };
};
