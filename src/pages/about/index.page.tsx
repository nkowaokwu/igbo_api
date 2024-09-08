import React from 'react';
import { Box, Heading, Text, Link, chakra } from '@chakra-ui/react';
import { FiMail } from 'react-icons/fi';
import Footer from '../components/Footer';
import { DICTIONARY_APP_URL } from '../../siteConstants';

const About = () => (
  <Box className="flex flex-col items-center h-screen">
    <Box
      className="flex flex-col px-8 mb-6 lg:justify-between xl:flex-row pt-10
      lg:pt-32 max-w-2xl lg:max-w-6xl text-gray-800 text-lg lg:text-xl w-full"
    >
      <Box className="max-w-3xl space-y-4 mb-10 text-gray-600">
        <Heading as="h1" className="text-3xl text-gray-700">
          About
        </Heading>
        <Text className="mb-6">
          The Igbo API is a multi-dialectal, audio-supported, open-to-contribute, Igbo-English
          dictionary API. This project focuses on enabling developers, organizations, and teams to
          create technology that relies on the Igbo language.
        </Text>
        <Text>
          Our main goal is to make an easy-to-access, robust, lexical Igbo language resource to help
          solve a variety of complex problems within the worlds of education to Machine Learning.
        </Text>
        <Text>
          {'The Igbo API hosts and serves all word and example sentence data that is shown on '}
          <Link className="link" href={DICTIONARY_APP_URL}>
            Nkọwa okwu
          </Link>
          , our official online Igbo-English dictionary app.
        </Text>

        <Text>
          {`The initial words and examples that populated this API came
              from Kay Williamson's Igbo Dictionary entitled `}
          <Link
            className="link"
            href="http://www.columbia.edu/itc/mealac/pritchett/00fwp/igbo/IGBO%20Dictionary.pdf"
          >
            {'Dictionary of Ònìchà Igbo. '}
          </Link>
        </Text>
        <Text>
          {'This is an '}
          <Link className="link" href="https://github.com/nkowaokwu/igbo_api">
            open-source project
          </Link>
          {' created by '}
          <Link className="link" href="https://twitter.com/ijemmaohno">
            Ijemma Onwuzulike
          </Link>
          .
        </Text>
      </Box>
    </Box>
    <Box
      className="flex flex-col px-8 max-w-2xl lg:max-w-6xl
        mb-10 lg:mb-24 text-gray-800 text-lg lg:text-xl w-full"
    >
      <Heading as="h1" className="text-gray-700" fontSize="2xl">
        Contact
      </Heading>
      <Text className="mt-6 text-gray-600 flex flex-row items-center space-x-2">
        <chakra.span>
          <FiMail />
        </chakra.span>
        <Link className="link" href="mailto:kedu@nkowaokwu.com">
          kedu@nkowaokwu.com
        </Link>
      </Text>
    </Box>
  </Box>
);

export default About;
