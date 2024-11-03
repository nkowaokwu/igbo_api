import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiKey, FiVideo } from 'react-icons/fi';

const LastCall = () => {
  const router = useRouter();

  return (
    <Box
      px="12"
      py="16"
      borderRadius="3xl"
      m="12"
      backgroundColor="gray.900"
      className="flex flex-col justify-center items-center"
    >
      <VStack className="w-10/12" gap={8}>
        <Heading
          as="h2"
          className="text-2xl text-center items-center p-5"
          fontSize={{ base: '4xl', lg: '5xl' }}
          color="white"
        >
          Connect to a Larger Nigerian Audience
        </Heading>
        <Text color="white" textAlign="center">
          Start using the Igbo API to build uniquely-Igbo digital experiences. Everything from
          generating subtitles, transcribing conversations, translating messages, and more.
        </Text>
        <HStack>
          <Button
            type="button"
            borderRadius="full"
            onClick={() => router.push('/signup')}
            rightIcon={<FiKey />}
          >
            Sign Up
          </Button>
          <Button
            type="button"
            borderRadius="full"
            variant="outline"
            color="white"
            onClick={() => router.push('/signup')}
            rightIcon={<FiVideo />}
          >
            Watch a Demo
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default LastCall;
