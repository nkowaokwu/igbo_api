import React from 'react';
import { As, Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { API_FROM_EMAIL } from '../../../siteConstants';

const UseCaseTemplate = ({
  content: { title, description, actionButtonLabel, image, page },
}: {
  content: {
    title: string,
    description: string,
    actionButtonLabel: string,
    image: string,
    page: { label: string, as: As, description: string, image: string }[],
  },
}) => {
  const handleButtonClick = () => {
    window.location.href = `mailto:${API_FROM_EMAIL}`;
  };
  return (
    <VStack width="full">
      <VStack className="w-10/12" gap={32} alignItems="start">
        <HStack justifyContent="space-between">
          <VStack className="w-1/2" alignItems="start" gap={8}>
            <Heading color="gray.900" fontSize="6xl">
              {title}
            </Heading>
            <Text>{description}</Text>
            <Button onClick={handleButtonClick} colorScheme="blue" borderRadius="full">
              {actionButtonLabel}
            </Button>
          </VStack>
          <Box
            backgroundColor="gray.400"
            borderRadius="md"
            height="500px"
            width="600px"
            backgroundImage={image}
            backgroundPosition="center"
            backgroundSize="cover"
          />
        </HStack>
        {page.map(({ label, as, description: contentDescription, image: contentImage }, index) => (
          <HStack
            key={label}
            width="full"
            flexDirection={index % 2 ? 'row-reverse' : 'row'}
            justifyContent="space-between"
          >
            <VStack alignItems="start" className="w-1/2">
              <Heading as={as} color="gray.900" fontSize="5xl">
                {label}
              </Heading>
              <Text>{contentDescription}</Text>
            </VStack>
            <Box
              backgroundColor="gray.400"
              borderRadius="md"
              height="500px"
              width="600px"
              backgroundImage={contentImage}
              backgroundPosition="center"
              backgroundSize="cover"
            />
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default UseCaseTemplate;
