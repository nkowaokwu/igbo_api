import React, { useState } from 'react';
import axios from 'axios';
import { map } from 'lodash';
import { API_URL } from '../config';

export default () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState([]);
  const [noMatch, setNoMatch] = useState('');

  const onEnter = (e) => {
    if (e.keyCode === 13) {
      searchWord();
    }
  }

  const searchWord = async () => {
    const res = await axios.get(`${API_URL}?keyword=${input}`);
    setResponse(res.data);
    setNoMatch(`No word matching ${input}`);
  }

  const renderWords = () => {
    const words = map(response, (wordObject) => {
      return (
        <div style={{ display: 'flex' }}>
          <div style={{ width: 200 }}>
            <h1>{wordObject.word}</h1>
            <p>{wordObject.wordClass}</p>
            <p>var.: {wordObject.variations.join(', ')}</p>
          </div>
          <div>
            <h2>Definitions</h2>
            {map(wordObject.definitions, (definition) => (
              <div>{definition}</div>
            ))}
            <h2>Phrases</h2>
            {map(wordObject.phrases, (phrase) => {
              return (
                <>
                  <div style={{ fontWeight: 'bold' }}>{phrase.phrase}</div>
                  {map(phrase.definitions, (definition) => (
                    <div>{definition}</div>
                  ))}
                </>
              );
            })}
          </div>
        </div>
      )  
    });
    return words.length ? words : noMatch;
  }

  return (
    <>
      <div>Welcome to the Igbo Dictionary</div>
      <input
        data-test="search-bar"
        placeholder="Search in Igbo or English"
        onInput={(e) => setInput(e.target.value)}
        onKeyDown={onEnter}
        />
      <button onClick={searchWord}>Search</button>
      <div>
        {renderWords()}
      </div>
    </>
  );
}
