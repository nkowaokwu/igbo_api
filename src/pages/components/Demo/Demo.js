import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Heading,
  Text,
  Input,
} from '@chakra-ui/react';
import omit from 'lodash/omit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import JSONPretty from 'react-json-pretty';
import { Checkbox } from 'antd';
import { API_ROUTE } from '../../../siteConstants';
import Header from '../Header';

const Demo = ({ searchWord, words }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchingWord, setIsSearchingWord] = useState(false);
  const [keyword, setKeyword] = useState(searchWord || '');
  const [queries, setQueries] = useState({});
  const [initialQueries, setInitialQueries] = useState({});
  const [productionUrl, setProductionUrl] = useState('');
  const { t } = useTranslation();
  const responseBody = JSON.stringify(words, null, 4);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedInitialQueries = queryString.parse(window.location.search);
      setProductionUrl(window.origin);
      setInitialQueries(loadedInitialQueries);
      setIsLoading(false);
      setQueries(omit(loadedInitialQueries, ['word']));
      setKeyword(loadedInitialQueries.word);
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

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  const constructRequestUrl = () => {
    const appendQueries = constructQueryString() || queryString.stringify(omit(initialQueries, ['word']));
    const requestUrl = `${productionUrl || API_ROUTE}/api/v1/words?keyword=${keyword || ''}`
    + `${keyword && appendQueries ? '&' : ''}`
    + `${appendQueries.replace('&', '')}`;
    return requestUrl;
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
    <Box className="flex justify-center mb-16">
      <Box
        className="grid grid-cols-1 lg:grid-cols-2"
      >
        <Box
          className="demo-inputs-container space-y-5 bg-white md:-mt-16 lg:mt-0 mb-8"
          borderColor="black"
          borderWidth="2px"
        >
          <form onSubmit={onSubmit} className="flex flex-col w-full">
            <Header
              title={t('Enter a word below')}
              description={t('Enter a word in either English or Igbo to see it\'s information')}
            />
            <Box p={8} className="space-y-5 h-fit">
              <Heading as="h2" fontFamily="Silka" fontSize="xl">{t('Flags')}</Heading>
              <Box className="flex space-x-8">
                <Box>
                  <Checkbox
                    className="flex items-center space-x-2"
                    defaultChecked={initialQueries.dialects}
                    onChange={handleDialects}
                    data-test="dialects-flag"
                  >
                    {t('Dialects')}
                  </Checkbox>
                </Box>
                <Box>
                  <Checkbox
                    className="flex items-center space-x-2"
                    defaultChecked={initialQueries.examples}
                    onChange={handleExamples}
                    data-test="examples-flag"
                  >
                    {t('Examples')}
                  </Checkbox>
                </Box>
              </Box>
              <Box
                className="flex flex-row justify-between items-center rounded-md"
                py={2}
                px={4}
                borderWidth="1px"
                borderColor="gray.400"
              >
                <Text
                  pointerEvents="none"
                  className="w-full rounded-md"
                  width="full"
                >
                  {constructRequestUrl()}
                </Text>
                <ContentCopyIcon sx={{ height: 20, cursor: 'pointer' }} />
              </Box>
              <Box className="flex flex-row items-center space-x-4">
                <Input
                  onInput={(e) => setKeyword(e.target.value)}
                  onKeyPress={onEnter}
                  className="w-full rounded-md"
                  p={5}
                  borderWidth="1px"
                  borderColor="gray.400"
                  placeholder="⌨️ i.e. please or biko"
                  data-test="try-it-out-input"
                  defaultValue={searchWord || initialQueries.word}
                />
                <Button
                  type="submit"
                  className="w-full transition-all duration-100"
                  backgroundColor="green.300"
                  color="white"
                  boxShadow="black"
                  borderColor="black"
                  p="20px"
                  _hover={{
                    backgroundColor: 'green.300',
                  }}
                  isLoading={isSearchingWord}
                  isDisabled={isSearchingWord}
                >
                  {t('Submit')}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
        <Box
          className="demo-inputs-container bg-white md:-mt-16 lg:mt-0 mb-8"
          borderColor="black"
          borderWidth="2px"
        >
          <Header title={t('Response')} />
          <Box position="relative" height="full">
            <JSONPretty
              className="jsonPretty h-full w-full self-center lg:w-auto bg-gray-800 p-2 overflow-auto"
              id="json-pretty"
              data={responseBody}
            />
            <ContentCopyIcon
              sx={{
                position: 'absolute',
                height: 20,
                fill: 'white',
                top: 8,
                right: 8,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
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
