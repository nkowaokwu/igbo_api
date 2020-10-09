import React, { useState } from 'react';
import axios from 'axios';
import { map } from 'lodash';
import { API_URL } from '../config';
import Word from '../components/Word';

const Home = () => {
  const [input, setInput] = useState('');
  const [lastSearch, setLastSearch] = useState(input);
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState([]);
  const [noMatch, setNoMatch] = useState('');

  const searchWord = async () => {
    const res = await axios.get(`${API_URL}?keyword=${input}`);
    setResponse(res.data);
    setNoMatch(`No word matching ${input}`);
  };

  const nextPage = async () => {
    const res = await axios.get(`${API_URL}?keyword=${lastSearch}&page=${page}`);
    setPage(page + 1);
    setResponse(res.data);
  };

  const onEnter = (e) => {
    if (e.keyCode === 13) {
      searchWord();
      setLastSearch(input);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-7/12">
        <h1 className="text-4xl my-3 mx-12">Igbo Dictionary</h1>
        <div className="w-full">
          <input
            className="bg-gray-300 rounded-full py-3 px-3 w-10/12"
            placeholder="Search in Igbo or English"
            onInput={(e) => setInput(e.target.value)}
            onKeyDown={onEnter}
          />
          <button
            className="w-2/12"
            onClick={searchWord}
            type="button"
          >
            Search
          </button>
        </div>
        {response.length > 0 ? map(response, (word) => <Word word={word} />) : noMatch}
        {response.length === 10 ? <button onClick={nextPage} type="button">More Words</button> : null}
      </div>
    </div>
  );
};

export default Home;
