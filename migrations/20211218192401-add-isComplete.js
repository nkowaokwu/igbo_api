/* eslint-disable max-len */
const wordsPipeline = [
  {
    $lookup: {
      from: 'examples',
      localField: '_id',
      foreignField: 'associatedWords',
      as: 'examples',
    },
  },
  {
    $addFields: {
      isComplete: {
        $function: {
          body: `function(word, wordClass, definitions = [], examples = [], pronunciation, isStandardIgbo) {
            var accentArray = ['á','à','ã','â','é','è','ê','í','ì','î','õ','ó','ò','ô','ú','ù','û','ị̀','ị́','ị̄','ọ́','ọ̀','ọ̄']
            var hasAccent = false;
            for(var i=0; i < word.length; i++){
              if (hasAccent) { break; }
                for(var j=0; j < accentArray.length; j++){
                  if (hasAccent) { break; } 
                    if(word[i] === accentArray[j]){
                      hasAccent = true;
                    }
                }
            }
            return !!(word
            && (hasAccent || word.match(/(?!\u0323)[\u0300-\u036f]/g))
            && wordClass
            && definitions.length
            && examples.length
            && pronunciation.length > 10
            && isStandardIgbo
            )
          }`,
          args: [
            '$word',
            '$wordClass',
            '$definitions',
            '$examples',
            '$pronunciation',
            '$isStandardIgbo',
          ],
          lang: 'js',
        },
      },
    },
  },
];

module.exports = {
  async up(db) {
    const collections = ['words', 'wordsuggestions'];
    await Promise.all(collections.map(async (collection) => {
      const wordDocs = await (await db.collection(collection).aggregate(wordsPipeline)).toArray();
      await Promise.all(wordDocs.map((wordDoc) => (
        db.collection(collection).updateOne(
          // eslint-disable-next-line
          { _id: wordDoc._id },
          { $set: { isComplete: wordDoc.isComplete } },
        )
      )));
    }));
  },

  async down(db) {
    const collections = ['words', 'wordsuggestions'];
    return collections.map((collection) => (
      db.collection(collection).updateMany({}, [{
        $unset: 'isComplete',
      }])
    ));
  },
};
