import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const numberWithCommas = (x = 0) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const Stat = ({
  value,
  header,
  exact = true,
  children,
}: {
  value: number;
  header: string;
  exact?: boolean;
  children?: any;
}) => (
  <Box
    className="flex flex-col justify-center items-center h-auto
    text-gray-700 text-center px-4 py-4 m-8 rounded-md"
  >
    <Heading as="h1" className="text-gray-700 font-bold" fontSize="6xl">{`${numberWithCommas(value)}${
      exact ? '' : '+'
    }`}</Heading>
    <Heading as="h3" className="text-gray-500" fontSize="3xl">
      {header}
    </Heading>
    {children}
  </Box>
);

export default Stat;
