import React from 'react';
import { map } from 'lodash';
import { WordPropTypes } from '../utils/PropTypeShapes';
import Example from './Example';

const Word = ({ word }) => (
  <div className="w-full">
    <div className="flex flex-row py-5">
      <div className="w-3/12">
        <div className="flex items-end">
          <h1 className="text-2xl mx-2">{word.word}</h1>
          <h3 className="text-gray-500 py-1 mx-2 italic">{word.wordClass}</h3>
        </div>
        <div>
          <h2>variations:</h2>
          <h3 className="text-gray-500 italic">{word.variations.join(', ')}</h3>
        </div>
      </div>
      <div className="flex w-9/12">
        <div className="w-7/12">
          {map(word.definitions, (definition, index) => (
            <h2>
              <span className="text-gray-600 text-lg mx-3">
                {`${index + 1}.`}
              </span>
              <span className="text-lg">{definition}</span>
            </h2>
          ))}
        </div>
        <div className="w-5/12">
          <h2 className="text-2xl">Examples</h2>
          {word.examples.length ? map(word.examples.slice(0, 3), (example) => <Example example={example} />) : 'No examples'}
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
