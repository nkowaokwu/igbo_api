import React from 'react';
import { Box, Heading, Text, Tooltip, chakra } from '@chakra-ui/react';

const Card = ({
  title,
  description,
  icon,
  tooltipLabel,
}: {
  title: string;
  description: string;
  icon: string;
  tooltipLabel?: string;
}) => (
  <Tooltip label={tooltipLabel}>
    <Box
      style={{
        maxHeight: 250,
        maxWidth: 400,
      }}
      className={`w-full flex flex-col items-center py-4 cursor-default
      shadow-md rounded-lg px-5 my-10 bg-gradient-to-t from-gray-50 to-white`}
    >
      <Box className="flex flex-row justif-start items-center space-x-2">
        <chakra.span className="rounded-full text-3xl w-16 bg-white my-4 justify-center text-center">
          {icon}
        </chakra.span>
        <Box>
          <Heading as="h1" className="font-bold text-gray-900" fontSize="2xl" mb={2}>
            {title}
          </Heading>
          <Text
            style={{
              maxHeight: 200,
              maxWidth: 400,
            }}
            className="text-l text-gray-500"
          >
            {description}
          </Text>
        </Box>
      </Box>
    </Box>
  </Tooltip>
);
export default Card;
