import React, { useState, useEffect, useRef } from 'react';
import { omit } from 'lodash';
import { Box, Button, Collapse, Checkbox, Heading, Input, Text } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import queryString from 'query-string';
import JSONPretty from 'react-json-pretty';
import { Example, Word } from '../../../../types';
import { WordDialect } from '../../../../types/word';

const IgboAPI = ({ searchWord, words }: { searchWord: string, words: Word[] }) => {
  const [keyword, setKeyword] = useState(searchWord);
  const [queries, setQueries] = useState({});
  const [initialQueries, setInitialQueries] = useState<{
    examples?: Example[],
    dialects?: WordDialect,
    word?: string,
  }>({});
  const [isSearchingWord, setIsSearchingWord] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const responseBody = JSON.stringify(words, null, 4);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedInitialQueries: { word?: string } = queryString.parse(window.location.search);
      setInitialQueries(loadedInitialQueries);
      setQueries(omit(loadedInitialQueries, ['word']));
      setKeyword(loadedInitialQueries?.word || '');
      if (keyword || loadedInitialQueries.word) {
        if (headingRef.current) {
          headingRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      className="flex flex-col items-center"
      p={4}
      width="full"
      borderRadius="md"
      borderWidth="1px"
    >
      <Box className="space-y-5 w-full" mb={responseBody !== '{}' ? 8 : ''}>
        <form onSubmit={onSubmit} className="flex flex-col w-full space-y-3">
          <Text fontStyle="italic" color="gray.400" pointerEvents="none">
            Enter a word in either Igbo or English to see it&apos;s information
          </Text>
          <Input
            size="large"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
            onKeyPress={onEnter}
            height={12}
            borderRadius="md"
            py={5}
            px={3}
            placeholder="⌨️ i.e. please or biko"
            data-test="try-it-out-input"
            defaultValue={searchWord || initialQueries.word}
          />
          <Box className="flex flex-row justify-between items-center">
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
            <Button
              type="submit"
              className="w-full transition-all duration-100"
              leftIcon={<FiSearch />}
              backgroundColor="blue.500"
              width={28}
              color="white"
              _hover={{
                backgroundColor: 'blue.400',
              }}
              borderRadius="full"
              isLoading={isSearchingWord}
              isDisabled={isSearchingWord}
            >
              Search
            </Button>
          </Box>
        </form>
      </Box>
      <Collapse in={responseBody !== '{}'} className="w-full">
        <Box className="w-full">
          <Heading as="h3" fontSize="2xl" color="gray.900">
            Response
          </Heading>

          <JSONPretty
            className="jsonPretty self-center lg:w-auto bg-gray-800 rounded-md p-2 overflow-auto w-full"
            id="json-pretty"
            data={responseBody}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default IgboAPI;
