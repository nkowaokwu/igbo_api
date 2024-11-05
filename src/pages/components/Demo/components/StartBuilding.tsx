import { Box, Button, Text } from '@chakra-ui/react';

const StartBuilding = () => (
  <Box className="flex flex-col lg:flex-row items-center lg:space-x-3 space-y-3 lg:space-y-0">
    <Text>Start building with the Igbo API today</Text>
    <Box className="flex flex-row items-center space-x-3">
      <Button
        colorScheme="blue"
        borderRadius="full"
        onClick={() => {
          window.location.pathname = '/signup';
        }}
      >
        Try for Free
      </Button>
      <Button colorScheme="blue" variant="outline" borderRadius="full">
        Watch a Demo
      </Button>
    </Box>
  </Box>
);

export default StartBuilding;
