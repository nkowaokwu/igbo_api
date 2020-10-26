import React, { useState } from 'react';
import axios from 'axios';
import { map } from 'lodash';
import { useForm } from 'react-hook-form';
import { WORDS_API_URL } from '../config';
import Word from '../components/Word';
import Modal from '../components/Modal';
import AddWord from '../forms/AddWord';

const Home = () => {
  const { reset } = useForm();
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(false);
  const [lastSearch, setLastSearch] = useState(input);
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState([]);
  const [noMatch, setNoMatch] = useState('');

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    reset();
    setVisible(false);
  };

  const searchWord = async () => {
    const res = await axios.get(`${WORDS_API_URL}?keyword=${input}`);
    setResponse(res.data);
    setNoMatch(`No word matching ${input}`);
  };

  const nextPage = async () => {
    const res = await axios.get(`${WORDS_API_URL}?keyword=${lastSearch}&page=${page}`);
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
      <div className="flex flex-col items-center w-11/12 lg:w-8/12">
        {process.env.NODE_ENV !== 'production' ? (
          <button
            type="button"
            onClick={showModal}
            data-test="add-button"
          >
            add word
          </button>
        ) : null}
        <h1 className="self-start lg:self-center text-2xl lg:text-4xl my-3 mx-2 lg:mx-12">Igbo Dictionary</h1>
        <div className="flex flex-col lg:flex-row w-full lg:justify-between lg:items-center">
          <input
            data-test="search-bar"
            className="bg-gray-300 rounded-full h-12 py-3 px-3 w-full lg:w-9/12"
            placeholder="Search in Igbo or English"
            onInput={(e) => setInput(e.target.value)}
            onKeyDown={onEnter}
          />
          <button
            className="w-full text-gray-100 bg-green-800 py-3 mt-5 lg:mt-0 rounded lg:w-2/12"
            onClick={searchWord}
            type="button"
          >
            Search
          </button>
        </div>
        {
          response.length > 0
            ? map(response, (word, idx) => <Word word={word} key={idx} />)
            : noMatch
        }
        {
          response.length === 10
            ? <button onClick={nextPage} type="button">More Words</button>
            : null
        }
      </div>
      <Modal
          title="Suggest a New Word"
          isOpen={visible}
          onRequestClose={handleCancel}
          className={`bg-white border-current border-solid border border-gray-200
          max-h-full h-8/12 w-full lg:w-10/12 p-12 rounded-lg shadow-lg
          overflow-scroll text-gray-800`}
      >
        <AddWord />
      </Modal>
    </div>
  );
};

export default Home;
