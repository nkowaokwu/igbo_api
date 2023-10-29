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
      <Box className="flex flex-row items-center space-x-2 justif-start">
        <chakra.span className="justify-center w-16 my-4 text-3xl text-center bg-white rounded-full">
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
            className="text-gray-500 text-l"
          >
            {description}
          </Text>
        </Box>
      </Box>
    </Box>
  </Tooltip>
);
export default Card;
