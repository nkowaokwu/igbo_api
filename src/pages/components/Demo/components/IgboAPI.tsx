import { Box, Button, Checkbox, Heading, Input, Text } from '@chakra-ui/react';
import { omit } from 'lodash';
import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import JSONPretty from 'react-json-pretty';
import { OutgoingExample } from '../../../../types';
import { OutgoingWord, WordDialect } from '../../../../types/word';
import { getDictionaryEndpoint } from '../../../APIs/PredictionAPI';

const IgboAPI = ({ searchWord }: { searchWord: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [words, setWords] = useState<OutgoingWord[]>([]);
  const [keyword, setKeyword] = useState(searchWord);
  const [queries, setQueries] = useState<{ dialects?: boolean, examples?: boolean }>({});
  const [initialQueries, setInitialQueries] = useState<{
    examples?: OutgoingExample[],
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    try {
      setIsSearchingWord(true);
      const fetchedWords = await getDictionaryEndpoint({ keyword, params: queries });
      setWords(fetchedWords.words);
    } finally {
      setIsSearchingWord(false);
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
  }, []);

  return (
    <Box
      className="flex flex-col items-center"
      p={4}
      width="full"
      borderRadius="md"
      borderWidth="1px"
      maxWidth="700px"
    >
      <Box className="space-y-5 w-full" mb={responseBody !== '{}' ? 8 : ''}>
        <form onSubmit={onSubmit} className="flex flex-col w-full space-y-3">
          <Text fontStyle="italic" color="gray.400" pointerEvents="none">
            Enter a word in either Igbo or English to see its information
          </Text>
          <Input
            size="large"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
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
              backgroundColor="blue.600"
              color="white"
              width={28}
              isLoading={isSearchingWord}
              isDisabled={isSearchingWord}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              rightIcon={
                <LuSearch
                  style={{
                    position: 'relative',
                    left: isHovered ? 4 : 0,
                    transition: 'left .2s ease',
                  }}
                />
              }
            >
              Search
            </Button>
          </Box>
        </form>
      </Box>
      <Box className="w-full" mt={4}>
        <Heading as="h3" fontSize="2xl" color="gray.900">
          Response
        </Heading>

        <JSONPretty
          className="jsonPretty self-center lg:w-auto bg-gray-800 rounded-md p-2 overflow-auto w-full"
          id="json-pretty"
          data={responseBody}
        />
      </Box>
    </Box>
  );
};

export default IgboAPI;
