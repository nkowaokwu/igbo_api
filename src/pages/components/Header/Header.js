import React from 'react';
import PropTypes from 'prop-types';
import { Box, Heading, Text } from '@chakra-ui/react';

const Header = ({ title, description }) => (
  <Box
    backgroundColor="cyan.400"
    borderColor="black"
    borderBottomWidth="2px"
    className="space-y-2"
    p={2}
  >
    <Heading
      as="h2"
      fontSize="xl"
      color="gray.700"
      fontFamily="Silka"
      textAlign="left"
    >
      {title}
    </Heading>
    <Text className="self-center md:self-start">
      {description}
    </Text>
  </Box>
);

Header.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

Header.defaultProps = {
  title: '',
  description: '',
};

export default Header;
