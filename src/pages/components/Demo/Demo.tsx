import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Box, Button, Checkbox, Heading, Input, Text, Link, Code } from '@chakra-ui/react';
import omit from 'lodash/omit';
import JSONPretty from 'react-json-pretty';
import { getWords } from '../../StatsAPI';
import { APP_URL, DICTIONARY_APP_URL } from '../../siteConstants';

const Demo = ({ defaultWord }: { defaultWord: string }) => {
  const searchParams = useSearchParams() || new Map();
  const [isSearchingWord, setIsSearchingWord] = useState(false);
  const [keyword, setKeyword] = useState(defaultWord);
  const [queries, setQueries] = useState<{ [key: string]: string }>({
    dialects: searchParams.get('dialects') || '',
    examples: searchParams.get('examples') || '',
  });
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const constructQueryString = () => {
    const queryString = Object.entries(queries).reduce((finalQueryString, [key, value]) => {
      if (key === 'word' || !value) {
        return finalQueryString;
      }
      return `${finalQueryString}&${key}=${value}`;
    }, '');

    return queryString;
  };

  const { isPending, data } = useQuery({
    queryKey: ['getWords'],
    queryFn: () => getWords(defaultWord, constructQueryString()),
  });

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
    const appendQueries = constructQueryString();
    const requestUrl =
      `${APP_URL}/api/v1/words?keyword=${keyword || ''}` +
      `${keyword && appendQueries ? '&' : ''}` +
      `${appendQueries.replace('&', '')}`;
    return requestUrl;
  };

  const handleDialects = ({ target }: { target: { checked: boolean } }) => {
    setQueries(
      target.checked
        ? { ...queries, dialects: String(target.checked) }
        : omit(queries, ['dialects'])
    );
  };

  const handleExamples = ({ target }: { target: { checked: boolean } }) => {
    setQueries(
      target.checked
        ? { ...queries, examples: String(target.checked) }
        : omit(queries, ['examples'])
    );
  };

  return (
    <Box className="flex flex-col items-center space-y-12">
      <Box className="flex flex-col items-center">
        <Heading
          ref={headingRef}
          as="h2"
          id="try-it-out"
          className="text-4xl text-blue-500 font-bold"
          fontSize={{ base: '5xl', lg: '6xl' }}
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
              className="w-full border-gray-600"
              height={12}
              borderRadius="10px"
              borderWidth="2px"
              py={5}
              px={3}
              placeholder="⌨️ i.e. please or biko"
              data-test="try-it-out-input"
              defaultValue={defaultWord}
            />
            <Heading as="h2" fontSize="2xl">
              Flags
            </Heading>
            <Box className="flex space-x-8">
              <Box>
                <Checkbox
                  className="flex items-center space-x-2"
                  defaultChecked={Boolean(searchParams.get('dialects'))}
                  onChange={handleDialects}
                  data-test="dialects-flag"
                >
                  Dialects
                </Checkbox>
              </Box>
              <Box>
                <Checkbox
                  className="flex items-center space-x-2"
                  defaultChecked={Boolean(searchParams.get('examples'))}
                  onChange={handleExamples}
                  data-test="examples-flag"
                >
                  Examples
                </Checkbox>
              </Box>
            </Box>
            <Code userSelect="none" className="w-full" p={3} wordBreak="break-all">
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
            data={!isPending ? data : []}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Demo;
