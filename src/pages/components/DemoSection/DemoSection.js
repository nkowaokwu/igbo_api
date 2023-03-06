import React from 'react';
import PropTypes from 'prop-types';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Demo from '../Demo';
import grid from '../../assets/images/grid.svg';

const DemoSection = ({ searchWord, words }) => {
  const { t } = useTranslation();

  return (
    <Box
      backgroundColor="orange.100"
      backgroundImage={grid.src}
      width="full"
      className="flex flex-col justify-center items-center space-y-12"
      p={20}
      pb={44}
    >
      <Box
        backgroundColor="orange.100"
        className="space-y-4 w-10/12"
        p={2}
      >
        <Heading
          as="h2"
          id="try-it-out"
          fontWeight="bold"
          color="black"
          fontSize="5xl"
        >
          {t('Biko, check it out for yourself!')}
        </Heading>
        <Text
          textAlign="center"
          className="px-6 lg:px-0 text-center lg:text-left text-gray-500"
        >
          {t('With each API key, you will get 2,500 requests per day, no wam at all.')}
        </Text>
      </Box>
      <Demo searchWord={searchWord} words={words} />
    </Box>
  );
};

DemoSection.propTypes = {
  searchWord: PropTypes.string,
  words: PropTypes.arrayOf(PropTypes.string),
};

DemoSection.defaultProps = {
  searchWord: '',
  words: [],
};

export default DemoSection;
