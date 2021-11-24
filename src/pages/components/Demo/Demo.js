import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import queryString from 'query-string';
import JSONPretty from 'react-json-pretty';
import { Input, Checkbox } from 'antd';
import { API_ROUTE, DICTIONARY_APP_URL } from '../../../siteConstants';

const Demo = ({ searchWord, words }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchWord);
  const [queries, setQueries] = useState({});
  const [initialQueries, setInitialQueries] = useState({});
  const [productionUrl, setProductionUrl] = useState('');
  const responseBody = JSON.stringify(words, null, 4);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProductionUrl(window.origin);
      setInitialQueries(queryString.parse(window.location.search));
      setIsLoading(false);
      if (keyword) {
        window.location.hash = 'try-it-out';
      }
    }
  }, []);

  const constructQueryString = () => {
    const queriesString = queryString.stringify(queries);
    return queriesString ? `&${queriesString}` : '';
  };

  const onSubmit = (e = {}) => {
    e.preventDefault();
    const appendQueries = constructQueryString();
    window.location.href = `/?word=${keyword}${appendQueries}`;
  };

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  const constructRequestUrl = () => {
    const appendQueries = constructQueryString();
    return `${productionUrl || API_ROUTE}/api/v1/words?keyword=${keyword}${appendQueries}`;
  };

  const handleDialects = ({ target }) => {
    if (target.checked) {
      setQueries({ ...queries, dialects: target.checked });
    } else {
      setQueries(omit(queries, ['dialects']));
    }
  };

  const handleExamples = ({ target }) => {
    if (target.checked) {
      setQueries({ ...queries, examples: target.checked });
    } else {
      setQueries(omit(queries, ['examples']));
    }
  };

  return !isLoading ? (
    <div className="flex justify-center mb-16">
      <div className="flex flex-col items-center md:items-start lg:flex-row lg:space-x-10 p-4 bg-gray-500 rounded-md">
        <div className="demo-inputs-container space-y-5 bg-white p-4 -mt-16 shadow-2xl rounded-md mb-8">
          <form onSubmit={onSubmit} className="flex flex-col w-full space-y-5">
            <h2>Enter a word below</h2>
            <p className="self-center md:self-start">
              {'Enter a word in either English or Igbo to see it\'s information'}
            </p>
            <h2 className="text-2xl">Flags</h2>
            <Input
              size="large"
              onInput={(e) => setKeyword(e.target.value)}
              onKeyPress={onEnter}
              className="h-12 w-full border-gray-600 border-solid border-2 rounded-md px-3 py-5"
              placeholder="i.e. please or biko"
              data-test="try-it-out-input"
              defaultValue={searchWord}
            />
            <div className="flex">
              <div className="mr-8">
                <Checkbox
                  className="flex items-center space-x-2"
                  defaultChecked={initialQueries.dialects}
                  onChange={handleDialects}
                  data-test="dialects-flag"
                >
                  Dialects
                </Checkbox>
              </div>
              <div className="ml-8">
                <Checkbox
                  className="flex items-center space-x-2"
                  defaultChecked={initialQueries.examples}
                  onChange={handleExamples}
                  data-test="examples-flag"
                >
                  Examples
                </Checkbox>
              </div>
            </div>
            <Input disabled value={constructRequestUrl()} className="w-full py-3 px-5" />
            <button type="submit" className="primary-button w-full">
              Submit
            </button>
            <p className="text-l text-center text-gray-700 self-center mb-24">
              {'Want to see how this data is getting used? Take a look at '}
              <a className="link" href={DICTIONARY_APP_URL}>
                Nkọwa okwu
              </a>
            </p>
          </form>
        </div>
        <div className="flex flex-col w-full lg:w-auto -mt-32">
          <h3
            className="text-center lg:text-left self-center w-full
          lg:w-auto lg:self-start text-2xl mb-5 mt-16 lg:mt-0 mt-4"
          >
            Response
          </h3>
          <JSONPretty
            className="jsonPretty w-full self-center lg:w-auto bg-gray-800 rounded-md p-2"
            id="json-pretty"
            data={responseBody}
          />
        </div>
      </div>
    </div>
  ) : null;
};

Demo.propTypes = {
  searchWord: PropTypes.string,
  words: PropTypes.arrayOf(PropTypes.shape({})),
};

Demo.defaultProps = {
  searchWord: '',
  words: [],
};

export default Demo;
