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
        minHeight: 120,
      }}
      className={`w-full flex flex-col items-center py-4 cursor-default
      shadow-sm rounded-lg px-5`}
      borderColor="gray.200"
      borderWidth="1px"
    >
      <Box className="flex flex-row items-center space-x-2 w-full">
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
            className="text-gray-500"
            fontSize="sm"
          >
            {description}
          </Text>
        </Box>
      </Box>
    </Box>
  </Tooltip>
);
export default Card;
