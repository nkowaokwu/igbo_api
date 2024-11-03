import { As, Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';

const UseCaseCard = ({
  label,
  as,
  description,
  image,
  flexDirection,
}: {
  label: string,
  as: As,
  description: string,
  image: string,
  flexDirection: 'row' | 'row-reverse',
}) => (
  <HStack
    key={label}
    width="full"
    flexDirection={{ base: 'column', lg: flexDirection }}
    justifyContent="space-between"
    gap={12}
  >
    <VStack alignItems="start" className="w-full lg:w-1/2">
      <Heading as={as} color="gray.900" fontSize="4xl">
        {label}
      </Heading>
      <Text>{description}</Text>
    </VStack>
    <Box p={20} backgroundColor="gray.100" borderRadius="md">
      <Box
        backgroundColor="gray.400"
        borderRadius="md"
        height="300px"
        width="400px"
        backgroundImage={image}
        backgroundPosition="center"
        backgroundSize="cover"
      />
    </Box>
  </HStack>
);

export default UseCaseCard;
