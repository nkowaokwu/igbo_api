import { Button, HStack, Link, Text } from '@chakra-ui/react';
import { LuArrowRight } from 'react-icons/lu';
import { VOLUNTEER_PAGE_URL } from '../../../../src/siteConstants';

const CallToAction = () => (
  <HStack
    width="full"
    justifyContent="center"
    gap={6}
    backgroundColor="blue.900"
    p={4}
    flexDirection={{ base: 'column', lg: 'row' }}
  >
    <Text color="white" fontWeight="medium" fontSize="md" textAlign="center">
      Join our team of Igbo audio recorders and translators to help advance Igbo NLP technology 🎙️
    </Text>
    <Link href={VOLUNTEER_PAGE_URL} target="_blank">
      <Button
        backgroundColor="white"
        color="black"
        fontWeight="bold"
        fontFamily="heading"
        rightIcon={<LuArrowRight />}
        fontSize="md"
      >
        Join here
      </Button>
    </Link>
  </HStack>
);

export default CallToAction;
