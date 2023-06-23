/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import omit from 'lodash/omit';
import { useTranslation } from 'react-i18next';
import queryString, { ParsedQuery } from 'query-string';
import JSONPretty from 'react-json-pretty';
import { Input, Checkbox } from 'antd';
import { API_ROUTE, DICTIONARY_APP_URL } from '../../../siteConstants';

interface DemoPropsInterface {
  searchWord: string;
  words: Record<string, string>[];
}

export default function Demo({ searchWord, words }: DemoPropsInterface) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchingWord, setIsSearchingWord] = useState(false);
  const [keyword, setKeyword] = useState(searchWord || '');
  const [queries, setQueries] = useState({});
  const [initialQueries, setInitialQueries] = useState<ParsedQuery<string>>();
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
      setKeyword(loadedInitialQueries.word as string);
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
    const requestUrl =
      `${productionUrl || API_ROUTE}/api/v1/words?keyword=${keyword || ''}` +
      `${keyword && appendQueries ? '&' : ''}` +
      `${appendQueries.replace('&', '')}`;
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
    <div className="flex justify-center mb-16">
      <div className="flex flex-col items-center p-4 rounded-md md:items-start xl:flex-row lg:space-x-10 bg-gradient-to-tl from-blue-100 to-white">
        <div className="p-4 mb-8 space-y-5 bg-white rounded-md shadow-2xl demo-inputs-container md:-mt-16 lg:mt-0">
          <form onSubmit={onSubmit} className="flex flex-col w-full space-y-5">
            <h2>{t('Enter a word below')}</h2>
            <p className="self-center md:self-start">
              {t("Enter a word in either English or Igbo to see it's information")}
            </p>
            <Input
              size="large"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
              onKeyPress={onEnter}
              className="w-full h-12 px-3 py-5 border-2 border-gray-600 border-solid rounded-md"
              placeholder="⌨️ i.e. please or biko"
              data-test="try-it-out-input"
              defaultValue={searchWord || initialQueries.word}
            />
            <h2 className="text-2xl">{t('Flags')}</h2>
            <div className="flex space-x-8">
              <div>
                <Checkbox
                  className="flex items-center space-x-2"
                  defaultChecked={initialQueries.dialects === 'true'}
                  onChange={handleDialects}
                  data-test="dialects-flag"
                >
                  {t('Dialects')}
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  className="flex items-center space-x-2"
                  defaultChecked={initialQueries.examples === 'true'}
                  onChange={handleExamples}
                  data-test="examples-flag"
                >
                  {t('Examples')}
                </Checkbox>
              </div>
            </div>
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
            <p className="self-center mb-24 text-center text-gray-700 text-l">
              {t('Want to see how this data is getting used? Take a look at ')}
              <a className="link" href={DICTIONARY_APP_URL} data-test="nkowaokwu-link">
                Nkọwa okwu
              </a>
            </p>
          </form>
        </div>
        <div className="flex flex-col w-full lg:w-auto xl:-mt-24">
          <h3 className="self-center w-full mb-5 text-2xl font-bold text-center text-gray-800 lg:text-left lg:mt-4 lg:w-auto lg:self-start">
            {t('Response')}
          </h3>
          <JSONPretty
            className="self-center w-full p-2 overflow-auto bg-gray-800 rounded-md jsonPretty lg:w-auto"
            id="json-pretty"
            data={responseBody}
          />
        </div>
      </div>
    </div>
  ) : null;
}
