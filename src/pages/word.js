import React, { useState, useEffect } from 'react';
import { map } from 'lodash';
import { getWord } from '../API';
import Navbar from '../components/Navbar';
import NoWord from '../components/NoWord';
import Modal from '../components/Modal';
import Select from '../components/Select';
import SearchBar from '../components/SearchBar';
import AddWord from '../forms/AddWord';
import AddExample from '../forms/AddExample';
import parseQueries from '../utils/parseQueries';

const word = ({ location }) => {
  const queries = location?.search ? parseQueries(location.search) : {};
  const [response, setResponse] = useState(null);
  const [renderNoWord, setRenderNoWord] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formType, setFormType] = useState();
  const [defaultValues, setDefaultValues] = useState({});

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const options = [
    {
      value: 'editWord',
      label: '📝 Suggest an Edit',
      onSelect: () => {
        setDefaultValues(response);
        setFormType('word');
        setVisible(true);
      },
    },
    {
      value: 'createExample',
      label: '📚 Create an Example',
      onSelect: () => {
        setDefaultValues(response);
        setFormType('example');
        setVisible(true);
      },
    },
  ];

  useEffect(() => {
    (async () => {
      const words = (await getWord(queries.word)).data;
      if (words.length) {
        setResponse(words[0]);
      } else {
        setRenderNoWord(true);
        setResponse({ word: queries.word });
      }
    })();
  }, []);
  return response?.word ? (
    <div className="page-container">
      <Navbar />
      <SearchBar />
      {renderNoWord ? (
        <NoWord
          word={queries.word}
          showAddWordModal={showModal}
          setDefaultValues={(value) => setDefaultValues(value)}
        />
      ) : (
        <div className="responsive-container px-2 lg:px-5">
          <div className="flex flex-col lg:flex-row justify-between mt-2 lg:mt-6">
            <div>
              <h1 className="text-4xl text-gray-800 mt-3 lg:mt-1">Word</h1>
              <h2 className="text-2xl text-gray-800 mt-3 lg:mt-1">{response?.word}</h2>
              <h1 className="text-4xl text-gray-800 mt-3 lg:mt-1">Part of Speech</h1>
              <h2 className="text-2xl text-gray-800 mt-3 lg:mt-1">{response?.wordClass}</h2>
            </div>
            <div>
              <h1 className="text-4xl text-gray-800 mt-3 lg:mt-1">Definitions</h1>
              {response.definitions.length ? map(response.definitions, (definition, index) => (
                <h2 className="text-xl text-gray-800">
                  <span className="text-gray-600 mr-2">
                    {`${index + 1}.`}
                  </span>
                  {definition}
                </h2>
              )) : null}
            </div>
          </div>
          {process.env.NODE_ENV !== 'production' ? (
            <div className="flex w-full justify-start lg:justify-end">
              {/* TODO: Abstract this select + modal logic into it's own component */}
              <Select
                className="w-32 h-8 mt-5"
                ContainerComponent={() => (
                  <div className="flex space-x-2 justify-center items-center">
                    <div>
                      <span role="img" aria-label="Hand writing with pen">✍🏾</span>
                      {' Actions'}
                    </div>
                  </div>
                )}
                options={options}
              />
            </div>
          ) : null}
          <div className="h-px bg-gray-300 w-full my-6" />
          <h1 className="text-4xl text-gray-800">Examples</h1>
          {response.examples.length ? map((response.examples), ({ igbo, english }) => (
            <div className="my-5">
              <h2 className="text-xl font-bold text-gray-800">{igbo}</h2>
              <h2 className="text-xl text-gray-600">{english}</h2>
            </div>
          )) : 'No examples'}
        </div>
      )}
      <Modal
        title={formType === 'word' ? 'Suggest a Word Edit' : formType === 'example' ? 'Create a New Example' : null}
        isOpen={visible}
        onRequestClose={handleCancel}
        className="modal-container"
      >
        {formType === 'word' ? (
          <AddWord defaultValues={defaultValues} />
        ) : formType === 'example' ? (
          <AddExample defaultValues={defaultValues} />
        ) : null}
      </Modal>
    </div>
  ) : null;
};

export default word;
