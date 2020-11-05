import React, { useState } from 'react';
import { map } from 'lodash';
import { WordPropTypes } from '../utils/PropTypeShapes';
import Example from './Example';
import Select from './Select';
import Modal from './Modal';
import DownChevron from '../assets/icons/downchevron.svg';
import AddWord from '../forms/AddWord';
import AddExample from '../forms/AddExample';

const Word = ({ word }) => {
  const [visible, setVisible] = useState(false);
  const [formType, setFormType] = useState();
  const [defaultValues, setDefaultValues] = useState({});
  const handleCancel = () => {
    setVisible(false);
  };

  const options = [
    {
      value: 'editWord',
      label: '📝 Suggest an Edit',
      onSelect: () => {
        setDefaultValues(word);
        setFormType('word');
        setVisible(true);
      },
    },
    {
      value: 'createExample',
      label: '📚 Create an Example',
      onSelect: () => {
        setDefaultValues(word);
        setFormType('example');
        setVisible(true);
      },
    },
  ];

  return (
    <div className="w-full" data-test="word">
      <div className="flex flex-col lg:flex-row py-5">
        <div className="w-full lg:w-3/12">
          <div className="flex flex-col lg:flex-row lg:items-end">
            <h1 className="text-3xl mx-2">{word.word}</h1>
            <h3 className="text-gray-500 py-1 mx-2 italic truncate ">{word.wordClass}</h3>
          </div>
          <div>
            <h2>variations:</h2>
            <h3 className="text-gray-500 italic">{word.variations.join(', ')}</h3>
            {process.env.NODE_ENV !== 'production' ? (
              <Select
                className="w-32 h-8 mt-5"
                ContainerComponent={() => (
                  <div className="flex space-x-2 justify-center items-center">
                    <div>
                      <span role="img" aria-label="Hand writing with pen">✍🏾</span>
                      {' Actions'}
                    </div>
                    <DownChevron />
                  </div>
                )}
                options={options}
              />
            ) : null}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row w-full lg:w-9/12">
          <div className="w-full my-6 lg:my-0 lg:w-7/12">
            {map(word.definitions, (definition, index) => (
              <h2>
                <span className="text-gray-600 text-lg mx-3">
                  {`${index + 1}.`}
                </span>
                <span className="text-lg">{definition}</span>
              </h2>
            ))}
          </div>
          <div className="w-full lg:w-5/12">
            <h2 className="text-2xl">Examples</h2>
            {word.examples.length ? (
              map(word.examples.slice(0, 3), (example) => <Example example={example} />)
            ) : 'No examples'}
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-300 w-full" />
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
  );
};

Word.propTypes = {
  word: WordPropTypes,
};

Word.defaultProps = {
  word: {},
};

export default Word;
