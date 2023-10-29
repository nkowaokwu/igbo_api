import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Text, Link } from '@chakra-ui/react';
import omit from 'lodash/omit';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import JSONPretty from 'react-json-pretty';
import { Input, Checkbox } from 'antd';
import { API_ROUTE, DICTIONARY_APP_URL } from '../../../siteConstants';
import { Example, Word } from '../../../types';
import { WordDialect } from '../../../types/word';

const Demo = ({ searchWord, words }: { searchWord?: string; words: Word[] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchingWord, setIsSearchingWord] = useState(false);
  const [keyword, setKeyword] = useState(searchWord);
  const [queries, setQueries] = useState({});
  const [initialQueries, setInitialQueries] = useState<{ examples?: Example[]; dialects?: WordDialect; word?: string }>(
    {}
  );
  const [productionUrl, setProductionUrl] = useState('');
  const { t } = useTranslation('common');
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
    const appendQueries = constructQueryString() || queryString.stringify(omit(initialQueries, ['word']));
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
    <Box className="flex justify-center mb-16">
      <Box
        className="flex flex-col items-center p-4 rounded-md md:items-start xl:flex-row lg:space-x-10 bg-gradient-to-tl from-blue-100 to-white"
      >
        <Box className="p-4 mb-8 space-y-5 bg-white rounded-md shadow-2xl demo-inputs-container md:-mt-16 lg:mt-0">
          <form onSubmit={onSubmit} className="flex flex-col w-full space-y-5">
            <Heading as="h2" fontSize="2xl">
              {t('Enter a word below')}
            </Heading>
            <Text className="self-center md:self-start">
              {t("Enter a word in either English or Igbo to see it's information")}
            </Text>
            <Input
              size="large"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
              onKeyPress={onEnter}
              className="w-full h-12 px-3 py-5 border-2 border-gray-600 border-solid rounded-md"
              placeholder="⌨️ i.e. please or biko"
              data-test="try-it-out-input"
              defaultValue={searchWord || initialQueries.word}
            />
            <Heading as="h2" fontSize="2xl">
              {t('Flags')}
            </Heading>
            <Box className="flex space-x-8">
              <Box>
                <Checkbox
                  className="flex items-center space-x-2"
                  defaultChecked={!!initialQueries.dialects}
                  onChange={handleDialects}
                  data-test="dialects-flag"
                >
                  {t('Dialects')}
                </Checkbox>
              </Box>
              <Box>
                <Checkbox
                  className="flex items-center space-x-2"
                  defaultChecked={!!initialQueries.examples}
                  onChange={handleExamples}
                  data-test="examples-flag"
                >
                  {t('Examples')}
                </Checkbox>
              </Box>
            </Box>
            <Input disabled value={constructRequestUrl()} className="w-full px-5 py-3" />
            <Button
              type="submit"
              className="w-full transition-all duration-100"
              backgroundColor="green.400"
              color="white"
              _hover={{
                backgroundColor: 'green.300',
              }}
              borderRadius="full"
              isLoading={isSearchingWord}
              isDisabled={isSearchingWord}
            >
              {t('Submit')}
            </Button>
            <Text className="self-center mb-24 text-center text-gray-700 text-l">
              {t('Want to see how this data is getting used? Take a look at ')}
              <Link className="link" href={DICTIONARY_APP_URL} data-test="nkowaokwu-link">
                Nkọwa okwu
              </Link>
            </Text>
          </form>
        </Box>
        <Box className="flex flex-col w-full lg:w-auto xl:-mt-24">
          <Heading
            as="h3"
            className="self-center w-full mb-5 text-center text-gray-800 lg:text-left lg:mt-4 lg:w-auto lg:self-start"
            fontSize="2xl"
          >
            {t('Response')}
          </Heading>
          <JSONPretty
            className="self-center w-full p-2 overflow-auto bg-gray-800 rounded-md jsonPretty lg:w-auto"
            id="json-pretty"
            data={responseBody}
          />
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default Demo;
