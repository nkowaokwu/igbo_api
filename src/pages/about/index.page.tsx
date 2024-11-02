import { Box, Heading, Link, Text, chakra } from '@chakra-ui/react';
import { FiMail } from 'react-icons/fi';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const About = () => (
  <>
    <Navbar to="/" />
    <Box pt={24} className="w-full">
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
              The Igbo API is a multi-modal, multi-purpose, feature-rich AI solution made available
              through an API.
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
      <Footer />
    </Box>
  </>
);

export default About;
