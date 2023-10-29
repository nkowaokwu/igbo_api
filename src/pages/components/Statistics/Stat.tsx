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
    className="flex flex-col items-center justify-center h-auto px-4 py-4 m-8 text-center text-gray-700 rounded-md"
  >
    <Heading as="h1" className="font-bold text-gray-700" fontSize="6xl">{`${numberWithCommas(value)}${
      exact ? '' : '+'
    }`}</Heading>
    <Heading as="h3" className="text-gray-500" fontSize="3xl">
      {header}
    </Heading>
    {children}
  </Box>
);

export default Stat;
