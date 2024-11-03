import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import useCases from '../../shared/useCases';
import UseCaseCard from './UseCaseCard';

const UseCases = () => (
  <VStack width="full">
    <HStack className="w-10/12" justifyContent="start">
      <VStack alignItems="start" className="w-1/2 lg:w-4/12">
        <Heading as="h1" fontSize="3xl" color="gray.900">
          The Igbo API
        </Heading>
        <Text color="gray.600" fontSize="sm">
          The Igbo API can be used for a variety of different technical teams looking to build
          unique, digital Igbo experiences.
        </Text>
      </VStack>
    </HStack>
    <VStack className="w-10/12" gap={24}>
      {useCases.map((useCase, index) => (
        <UseCaseCard
          key={useCase.label}
          {...useCase}
          flexDirection={index % 2 ? 'row-reverse' : 'row'}
        />
      ))}
    </VStack>
  </VStack>
);

export default UseCases;
