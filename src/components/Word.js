import React from 'react';
import { map } from 'lodash';
import { WordPropTypes } from '../utils/PropTypeShapes';
import Example from './Example';
import Phrase from './Phrase';
import AudioButton from './AudioButton';

const Word = ({ word }) => (
  <div className="w-full my-5">
    <div className="flex flex-row h-64">
      <div className="w-3/12">
        <div className="flex items-end">
          <h1 className="text-3xl mx-2">{word.word}</h1>
          <h3 className="text-gray-500 py-1 mx-2 italic">{word.wordClass}</h3>
        </div>
        <div>
          <AudioButton />
          <h2>variations:</h2>
          <h3 className="text-gray-500 italic">{word.variations.join(', ')}</h3>
        </div>
      </div>
      <div className="flex w-9/12">
        <div className="w-7/12">
          {map(word.definitions, (definition, index) => (
            <h2>
              <span className="text-gray-600">
                {`${index + 1}.`}
              </span>
              {definition}
            </h2>
          ))}
          {map(word.examples.slice(0, 3), (example) => <Example example={example} />)}
        </div>
        <div className="w-5/12">
          <h2 className="text-2xl">Phrases</h2>
          {map(word.phrases.slice(0, 3), (phrase) => <Phrase phrase={phrase} />)}
        </div>
      </div>
    </div>
    <div className="h-px bg-gray-300 w-full" />
  </div>
);

Word.propTypes = {
  word: WordPropTypes,
};

Word.defaultProps = {
  word: {},
};

export default Word;
