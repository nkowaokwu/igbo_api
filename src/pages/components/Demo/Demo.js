import React, { useState } from 'react';
import JSONPretty from 'react-json-pretty';
import { API_ROUTE, DICTIONARY_APP_URL } from '../../../config';
import { transition } from '../../../shared/constants/styles';

const Demo = () => {
  const [keyword, setKeyword] = useState('');
  const [responseBody, setResponseBody] = useState(null);

  const onSubmit = () => {
    // eslint-disable-next-line no-undef
    fetch(`${API_ROUTE}/api/v1/words?keyword=${keyword}`).then(async (res) => {
      const text = await res.text();
      setResponseBody(text, null, 4);
    });
  };

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center md:items-start lg:flex-row lg:space-x-10">
        <div className="demo-inputs-container space-y-5">
          <div className="flex flex-col w-full space-y-5">
            <p className="self-center md:self-start">
              {'Enter a word in either English or Igbo to see it\'s information'}
            </p>
            <input
              onInput={(e) => setKeyword(e.target.value)}
              onKeyPress={onEnter}
              className="h-12 w-full border-current border-solid border-2 rounded-md px-3 py-5"
              placeholder="i.e. please or biko"
            />
            <input disabled value={`${API_ROUTE}/api/v1/words?keyword=${keyword}`} className="w-full py-3 px-5" />
            <button
              type="button"
              onClick={onSubmit}
              className={`${transition} h-12 w-full rounded-md hover:bg-green-600 bg-green-800 text-gray-100`}
            >
              Submit
            </button>
            <p className="text-l text-center text-gray-700 self-center mb-24">
              {'Want to see how this data is getting used? Take a look at the '}
              <a className={`${transition} text-green-400 hover:text-green-700`} href={DICTIONARY_APP_URL}>
                dictionary app
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="self-center lg:self-start text-2xl mb-5 mt-10 lg:mt-0">Response</h3>
          <JSONPretty className="jsonPretty" id="json-pretty" data={responseBody} />
        </div>
      </div>
    </div>
  );
};

export default Demo;
