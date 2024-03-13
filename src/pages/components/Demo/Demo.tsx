import React, { useState, useEffect } from 'react';
import { Box, Button, Checkbox, Heading, Input, Text, Link, Code } from '@chakra-ui/react';
import omit from 'lodash/omit';
import queryString from 'query-string';
import JSONPretty from 'react-json-pretty';
import { API_ROUTE, DICTIONARY_APP_URL } from '../../../siteConstants';
import { Example, Word } from '../../../types';
import { WordDialect } from '../../../types/word';

const Demo = ({ searchWord, words }: { searchWord?: string, words: Word[] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchingWord, setIsSearchingWord] = useState(false);
  const [keyword, setKeyword] = useState(searchWord);
  const [queries, setQueries] = useState({});
  const [initialQueries, setInitialQueries] = useState<{
    examples?: Example[],
    dialects?: WordDialect,
    word?: string,
  }>({});
  const [productionUrl, setProductionUrl] = useState('');
  const responseBody = JSON.stringify(words, null, 4);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedInitialQueries: { word?: string } = queryString.parse(window.location.search);
      setProductionUrl(window.origin);
      setInitialQueries(loadedInitialQueries);
      setIsLoading(false);
      setQueries(omit(loadedInitialQueries, ['word']));
      setKeyword(loadedInitialQueries?.word);
      if (keyword || loadedInitialQueries.word) {
        window.location.hash = 'try-it-out';
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const constructQueryString = () => {
    const queriesString = queryString.stringify(queries);
    return queriesString ? `&${queriesString}` : '';
  };

  const onSubmit = (e = { preventDefault: () => {} }) => {
    e.preventDefault();
    setIsSearchingWord(true);
    const appendQueries = constructQueryString();
    window.location.href = `/?word=${keyword}${appendQueries}`;
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  const constructRequestUrl = () => {
    const appendQueries =
      constructQueryString() || queryString.stringify(omit(initialQueries, ['word']));
    const requestUrl =
      `${productionUrl || API_ROUTE}/api/v1/words?keyword=${keyword || ''}` +
      `${keyword && appendQueries ? '&' : ''}` +
      `${appendQueries.replace('&', '')}`;
    return requestUrl;
  };

  const handleDialects = ({ target }: { target: { checked: boolean } }) => {
    if (target.checked) {
      setQueries({ ...queries, dialects: target.checked });
    } else {
      setQueries(omit(queries, ['dialects']));
    }
  };

  const handleExamples = ({ target }: { target: { checked: boolean } }) => {
    if (target.checked) {
      setQueries({ ...queries, examples: target.checked });
    } else {
      setQueries(omit(queries, ['examples']));
    }
  };

  return !isLoading ? (
    <Box className="flex flex-col items-center space-y-12">
      <Box className="flex flex-col items-center">
        <Heading
          as="h2"
          id="try-it-out"
          className="text-4xl text-blue-500 font-bold"
          fontSize="6xl"
        >
          Test Drive the API
        </Heading>
        <Text className="px-6 lg:px-0 text-center lg:text-left text-gray-500">
          With each API key, you will get 2,500 requests per day.
        </Text>
      </Box>
      <Box
        className="flex flex-col items-center md:items-start xl:flex-row
        lg:space-x-10 p-4 bg-gradient-to-tl from-blue-100 to-white rounded-md w-full"
      >
        <Box className="demo-inputs-container space-y-5 bg-white p-4 md:-mt-16 lg:mt-0 shadow-2xl rounded-md mb-8">
          <form onSubmit={onSubmit} className="flex flex-col w-full space-y-5">
            <Heading as="h2" fontSize="2xl">
              Enter a word below
            </Heading>
            <Text className="self-center md:self-start">
              Enter a word in either English or Igbo to see it&apos;s information
            </Text>
            <Input
              size="large"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
              onKeyPress={onEnter}
              className="h-12 w-full border-gray-600 border-solid border-2 rounded-md px-3 py-5"
              placeholder="⌨️ i.e. please or biko"
              data-test="try-it-out-input"
              defaultValue={searchWord || initialQueries.word}
            />
            <Heading as="h2" fontSize="2xl">
              Flags
            </Heading>
            <Box className="flex space-x-8">
              <Box>
                <Checkbox
                  className="flex items-center space-x-2"
                  defaultChecked={!!initialQueries.dialects}
                  onChange={handleDialects}
                  data-test="dialects-flag"
                >
                  Dialects
                </Checkbox>
              </Box>
              <Box>
                <Checkbox
                  className="flex items-center space-x-2"
                  defaultChecked={!!initialQueries.examples}
                  onChange={handleExamples}
                  data-test="examples-flag"
                >
                  Examples
                </Checkbox>
              </Box>
            </Box>
            <Code userSelect="none" className="w-full py-3 px-5" wordBreak="break-all">
              {constructRequestUrl()}
            </Code>
            <Button
              type="submit"
              className="w-full transition-all duration-100"
              backgroundColor="blue.500"
              color="white"
              _hover={{
                backgroundColor: 'blue.400',
              }}
              borderRadius="full"
              isLoading={isSearchingWord}
              isDisabled={isSearchingWord}
            >
              Submit
            </Button>
            <Text className="text-l text-center text-gray-700 self-center mb-24">
              {'Want to see how this data is getting used? Take a look at '}
              <Link className="link" href={DICTIONARY_APP_URL} data-test="nkowaokwu-link">
                Nkọwa okwu
              </Link>
            </Text>
          </form>
        </Box>
        <Box className="flex flex-col w-full lg:w-auto">
          <Heading
            as="h3"
            className="text-center lg:text-left self-center lg:mt-4
          lg:w-auto lg:self-start mb-5 text-gray-800"
            fontSize="2xl"
          >
            Response
          </Heading>
          <JSONPretty
            className="jsonPretty self-center lg:w-auto bg-gray-800 rounded-md p-2 overflow-auto w-full"
            id="json-pretty"
            data={responseBody}
          />
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default Demo;
