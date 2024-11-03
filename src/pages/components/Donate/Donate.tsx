import { Button, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { DONATE_URL } from '../../../siteConstants';

const Donate = () => (
  <VStack width="full" my={6}>
    <VStack className="w-10/12 lg:w-4/12" textAlign="center">
      <Heading as="h2" color="gray.900">
        Donate to the Igbo API
      </Heading>
      <Text fontSize="md" color="gray.700" fontWeight="medium">
        Donations will help us keep doing what we&apos;re doing. If you believe in what we&apos;re
        doing and want to support, please donate 🤍
      </Text>
      <VStack p={4} minWidth="220px">
        <VStack gap={0} width="full">
          <Text fontSize="sm">Donate to Nkọwa okwu</Text>
          <Text fontSize="3xl" fontWeight="medium">
            $15.00
          </Text>
        </VStack>
        <Link href={DONATE_URL} width="full">
          <Button
            fontSize="md"
            backgroundColor="blue.600"
            color="white"
            width="full"
            _hover={{ backgroundColor: 'blue.600' }}
          >
            Donate
          </Button>
        </Link>
      </VStack>
    </VStack>
  </VStack>
);

export default Donate;
