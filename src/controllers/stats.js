import Word from '../models/Word';

export const APIStats = async (req, res, next) => {
  try {
    const updatedWord = await Word.countDocuments({}).then(async (word) => {
      if (!word) {
        throw new Error('No word exists');
      }
      return word;
    });
    return res.send(updatedWord);
  } catch (err) {
    return next(err);
  }
};
